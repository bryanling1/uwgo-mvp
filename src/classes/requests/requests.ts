import axios from "axios";
import { NodeListItem, NavigationResponse, Avoidances } from "types/types";

const BASE_URL = process.env.REACT_APP_BACKEND_ROUTES ? "http://localhost:8000/api" : "http://localhost:3001"
const timeoutReturn = async (time:number, val:any) => {
	await new Promise((res) => setTimeout(res, time));
	return val;
}
const DUMMY_LOCATIONS = {
  "nodes":[
    {
      "id": "1",
      "name": "E7 4043"
    },
    {
      "id": "11",
      "name": "E5 Bridge"
    }
  ]
}

const DUMMY_ROUTE = {"arrivalTime":"NULLTIME","nodes":[
  {"id":"1","imageURL":"https://i.ibb.co/fSD59BF/1-min.jpg","instruction":{"description":"Turn left","icon":1,"title":"E7 4043"},"name":"E7 4043","overlayItems":{"type":1,"x":0,"y":100}},
  {"id":"2","imageURL":"https://i.ibb.co/hMSZ5CD/2-min.jpg","instruction":{"description":"Turn right","icon":2,"title":"E7 4th Floor Intersection"},"name":"E7 4th Floor Intersection","overlayItems":{"type":2,"x":0,"y":-150}},
  {"id":"4","imageURL":"https://i.ibb.co/0h8yrmM/3-min.jpg","instruction":{"description":"Continue going straight","icon":0,"title":"E7 4th Floor Doorway Intersection"},"name":"E7 4th Floor Doorway Intersection","overlayItems":{"type":0,"x":0,"y":20}},
  {"id":"5","imageURL":"https://i.ibb.co/nfm1812/4-min.jpg","instruction":{"description":"Continue going straight","icon":0,"title":"E5 4th Floor to 3rd Floor Stairway Entrance"},"name":"E5 4th Floor to 3rd Floor Stairway Entrance","overlayItems":{"type":0,"x":0,"y":20}},
  {"id":"6","imageURL":"https://i.ibb.co/0DdPngQ/5-min.jpg","instruction":{"description":"Turn left","icon":1,"title":"E5 4th Floor to 3rd Floor Stairway Exit"},"name":"E5 4th Floor to 3rd Floor Stairway Exit","overlayItems":{"type":1,"x":0,"y":20}},
  {"id":"11","imageURL":"https://i.ibb.co/rM3KXQf/6-min.jpg","instruction":{"description":"YOU HAVE ARRIVED","icon":3,"title":"E5 Bridge"},"name":"E5 Bridge"}]}


export class Requests {
  private static get url() {
    return BASE_URL;
  }
  static getLocations = async (): Promise<NodeListItem[]> => {
    if(!process.env.REACT_APP_BACKEND_ROUTES){
      return await timeoutReturn(1000, DUMMY_LOCATIONS.nodes)
    }
    const data = await axios.get(`${this.url}/locations`);
    return data.data.nodes;
  };

  static getNavigation = async (
    startId: string,
    endId: string,
    avoidances: Avoidances
  ): Promise<NavigationResponse> => {
    if(!process.env.REACT_APP_BACKEND_ROUTES){
      return await timeoutReturn(1000, DUMMY_ROUTE)
    }
    const data = process.env.REACT_APP_BACKEND_ROUTES ? 
      await axios.get(`${this.url}/route?start=${startId}&end=${endId}&options=${JSON.stringify(avoidances)}`) : 
      await axios.get(`${this.url}/route/1`);
    return data.data;
  };
}

export default Requests;