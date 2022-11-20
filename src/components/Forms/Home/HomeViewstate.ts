import { makeAutoObservable } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { NodeListItem } from "types/types";
import Requests from "classes/requests/requests";

export enum Avoidance {
  ELEVATORS = "Elevators",
  OUTSODE = "Outside",
}

export class HomeViewstate {
  private _isLoading = true;
  private _currentId = "";
  private _destinationId = "";
  private _avoidanceKeys: {
    [key: string]: string;
  } = {};
  private getNodesResponse?: IPromiseBasedObservable<NodeListItem[]>;

  constructor() {
    makeAutoObservable(this);
  }

  init = () => {
    this.getNodesResponse = fromPromise(Requests.getLocations());
  };

  get isLoading() {
    return this._isLoading;
  }

  setCurrentId = (id: string) => {
    this._currentId = id;
    if(this._currentId == this._destinationId){ //adjust if its the same
      for(let i=0; i<this.locations.length;i++){
        if(this._destinationId != this.locations[i].id){
          this._destinationId = this.locations[i].id
          break;
        }
      }
    }
  };

  get currentId() {
    return this._currentId;
  }

  setDestinationId = (id: string) => {
    this._destinationId = id;
    if(this._currentId == this._destinationId){ //adjust if its the same
      for(let i=0; i<this.locations.length;i++){
        if(this._currentId != this.locations[i].id){
          this._currentId = this.locations[i].id
          break;
        }
      }
    }
  };

  get destinationId() {
    return this._destinationId;
  }

  setAvoidance = (key: Avoidance, val: boolean) => {
    if (val === false) {
      delete this._avoidanceKeys[key];
      return;
    }
    this._avoidanceKeys[key] = "true";
  };

  get avoidances() {
    return this._avoidanceKeys;
  }

  get out() {
    return {
      start: this._currentId,
      end: this._destinationId,
      options: JSON.stringify({ ...this._avoidanceKeys }),
    };
  }

  get locations(): NodeListItem[] {
    return (
      this.getNodesResponse?.case({
        fulfilled: data => {
          if (data.length >= 2) {
            this._currentId = data[0].id;
            this._destinationId = data[1].id;
            this._isLoading = false;
          }
          return data;
        },
      }) ?? []
    );
  }

  get queryParams() {
    return new URLSearchParams(this.out).toString();
  }
}
