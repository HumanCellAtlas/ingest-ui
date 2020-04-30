import {MetadataFieldDirective} from './metadata-field.directive';
import {ComponentFactoryResolver, ViewContainerRef} from '@angular/core';

describe('MetadataFieldDirective', () => {
  let resolverSpy: jasmine.SpyObj<ComponentFactoryResolver>;
  let containerSpy: jasmine.SpyObj<ViewContainerRef>;

  beforeEach(() => {
    resolverSpy = jasmine.createSpyObj(['resolveComponentFactory']) as jasmine.SpyObj<ComponentFactoryResolver>;
    containerSpy = jasmine.createSpyObj(['createComponent']) as jasmine.SpyObj<ViewContainerRef>;

    it('should create an instance', () => {
      const directive = new MetadataFieldDirective(resolverSpy, containerSpy);
      expect(directive).toBeTruthy();
    });
  });

});
