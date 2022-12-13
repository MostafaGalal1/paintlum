import { DataService } from 'src/app/Services/data.service';
import { DrawDirective } from './draw.directive';

describe('DrawDirective', () => {
  it('should create an instance', () => {
    const directive = new DrawDirective(new DataService);
    expect(directive).toBeTruthy();
  });
});
