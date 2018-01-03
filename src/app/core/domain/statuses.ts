import { StatusService } from "../service/status.service";

export class Statuses {
  
  constructor(private statusService: StatusService) {
  	this.getAllStatuses();
  }

  getAllStatuses() {
  	return this.statusService.getStatuses();
  }
}

