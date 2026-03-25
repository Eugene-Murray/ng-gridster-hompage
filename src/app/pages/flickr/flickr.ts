import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlickrService, FlickrPhoto, FlickrPhotoset } from '../../services/flickr.service';

@Component({
  selector: 'app-flickr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flickr.html',
  styleUrl: './flickr.scss'
})
export class FlickrComponent implements OnInit {
  private readonly flickrService = inject(FlickrService);

  photos = signal<FlickrPhoto[]>([]);
  photosets = signal<FlickrPhotoset[]>([]);
  selectedPhotoset = signal<FlickrPhotoset | null>(null);
  loading = signal(false);
  loadingPhotosets = signal(false);
  error = signal<string | null>(null);

  readonly USER_ID = '81402075@N00';

  ngOnInit(): void {
    this.loadPhotosets();
  }

  private loadPhotosets(): void {
    this.loadingPhotosets.set(true);
    this.error.set(null);

    this.flickrService.getPhotosets().subscribe({
      next: photosets => {
        this.photosets.set(photosets);
        this.loadingPhotosets.set(false);
        if (photosets.length > 0) {
          this.selectPhotoset(photosets[0]);
        }
      },
      error: () => {
        this.error.set('Failed to load photosets. Please try again later.');
        this.loadingPhotosets.set(false);
      }
    });
  }

  selectPhotoset(photoset: FlickrPhotoset): void {
    this.selectedPhotoset.set(photoset);
    this.loadPhotos(photoset.id);
  }

  onPhotosetChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    const found = this.photosets().find(ps => ps.id === id);
    if (found) {
      this.selectPhotoset(found);
    }
  }

  private loadPhotos(photosetId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.photos.set([]);

    this.flickrService.getPhotosetPhotos(photosetId).subscribe({
      next: photos => {
        this.photos.set(photos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load photos. Please try again later.');
        this.loading.set(false);
      }
    });
  }

  flickrPhotoUrl(photoId: string): string {
    return `https://www.flickr.com/photos/${this.USER_ID}/${photoId}`;
  }
}
