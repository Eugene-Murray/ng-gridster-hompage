import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlickrService, FlickrPhoto } from '../../services/flickr.service';

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
  loading = signal(false);
  error = signal<string | null>(null);

  readonly USER_ID = '81402075@N00';

  ngOnInit(): void {
    this.loadPhotos();
  }

  private loadPhotos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.flickrService.getPhotosetPhotos().subscribe({
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
