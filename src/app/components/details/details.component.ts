import {Component, OnInit, OnDestroy} from '@angular/core';
import {Game} from "../../models/models";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {HttpService} from "../../services/http.service";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  public gameRating: number = 0;
  public gameId: string;
  public game: Game;
  private routeSub: Subscription;
  private gameSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      this.gameId = params['id'];
      this.getGameDetails(this.gameId);
    });
  }

  getGameDetails(id: string): void {
    this.gameSub = this.httpService
      .getGameDetails(id)
      .subscribe((gameResp: Game) => {
        this.game = gameResp;

        setTimeout(() => {
          this.gameRating = this.game.metacritic;
        }, 1000)
      })
  }

  getColor(value: number): string {
    if (value >= 75) {
      return '#5ee432';
    } else if (value < 75 && value >= 50) {
      return '#fffa50';
    } else if (value < 50 && value >= 30) {
      return '#f7aa38';
    } else {
      return '#ef4655';
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }
  }

}
