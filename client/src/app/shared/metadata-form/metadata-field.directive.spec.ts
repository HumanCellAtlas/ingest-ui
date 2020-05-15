import {MetadataFieldDirective} from './metadata-field.directive';
import {ViewContainerRef} from '@angular/core';

describe('MetadataFieldDirective', () => {
  let containerSpy: jasmine.SpyObj<ViewContainerRef>;

  beforeEach(() => {
    containerSpy = jasmine.createSpyObj(['createComponent']) as jasmine.SpyObj<ViewContainerRef>;

    it('should create an instance', () => {
      const directive = new MetadataFieldDirective(containerSpy);
      expect(directive).toBeTruthy();
    });
  });

});
