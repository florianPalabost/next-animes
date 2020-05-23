export class Anime {
  id: string;
  title: string;
  genres: [];
  image: string;
  ytVideoId: string;
  rating: any;
  startDate: any;
  status: string;
  nbEpisode: any;
  synopsis: any;
  // categories: [];
  userLike: boolean;
  userWatched: boolean;
  userWantToWatch: boolean;

  constructor(anime: any) {
    this.id = anime.id;
    this.title = anime?.attributes?.canonicalTitle || anime.title;
    this.ytVideoId = anime?.attributes?.youtubeVideoId || anime.ytVideoId;
    this.rating = anime?.attributes?.averageRating || anime.rating;
    this.startDate = anime?.attributes?.startDate || anime.startDate;
    this.status = anime?.attributes?.status || anime.status;
    this.nbEpisode = anime?.attributes?.episodeCount || anime.nbEpisode;
    this.synopsis = anime?.attributes?.synopsis || anime.synopsis;
    this.genres = anime.genres;
    this.image = anime.image;
    this.userLike = anime.userLike || false;
    this.userWatched = anime.userWatched || false;
    this.userWantToWatch = anime.userWantToWatch || false;
  }
}
