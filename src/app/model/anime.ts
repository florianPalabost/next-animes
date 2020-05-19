export class Anime {
  id: string;
  title: string;
  genres: [];
  // categories: [];
  userLike: boolean;
  userWatched: boolean;
  userWantToWatch: boolean;

  constructor(anime: any) {
    this.id = anime.id;
    this.title = anime.attributes.canonicalTitle;
    this.genres = anime.genres;
    this.userLike = false;
    this.userWatched = false;
    this.userWantToWatch = false;
  }
}
