import {FieldNode, MetadataDetailComponent} from './metadata-detail.component';
import {of} from "rxjs";

describe('MetadataDetailComponent', () => {
  let cmp: MetadataDetailComponent;
  let routerSpy: any;
  let ingestSpy: any;

  beforeEach(() => {
    routerSpy = {
      snapshot: {
        paramMap: jasmine.createSpyObj(['get'])
      }
    };
    routerSpy.snapshot.paramMap.get.withArgs('uuid').and.returnValue('uuid');
    routerSpy.snapshot.paramMap.get.withArgs('type').and.returnValue('type');
    ingestSpy = jasmine.createSpyObj(['getEntityByUuid']);
    ingestSpy.getEntityByUuid.and.returnValue(of({content: {'key': 'val'}}));
    cmp = new MetadataDetailComponent(routerSpy, ingestSpy)
  });

  it('should set attributes when created', () => {
    expect(cmp.uuid).toEqual('uuid');
    expect(cmp.type).toEqual('type');
    expect(cmp.json).toEqual({content: {'key': 'val'}})
  })

  describe('buildTree', () => {
    it('should convert json to field node tree', () => {
      const tree = cmp.buildTree({'key': {'key1': 'val'}}, 0);
      const child = new FieldNode();
      child.name = 'key1';
      child.value = 'val';
      const expected: FieldNode[] = [new FieldNode()];
      expected[0].name = 'key'
      expected[0].children = [child];

      expect(tree).toEqual(expected)
    })
  })
});
