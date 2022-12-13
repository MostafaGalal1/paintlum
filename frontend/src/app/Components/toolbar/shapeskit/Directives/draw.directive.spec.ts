import { DataService } from 'src/app/Services/data.service';
import { DrawDirective } from './draw.directive';
import {DataService} from "../../../../Services/data.service";

describe('DrawDirective', () => {
  it('should create an instance', () => {
    const directive = new DrawDirective(new DataService);
    expect(directive).toBeTruthy();
  });
});
