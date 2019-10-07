import {ConcreteTypePipe} from "./concrete-type.pipe";


describe('ConcreteType Pipe', () => {
  describe('transform function', () => {
    let pipe;

    beforeEach(() => {
      pipe = new ConcreteTypePipe();
    });

    it('should return concrete type for same domain type', () => {
      const res = pipe.transform({
        describedBy: 'https://schema.dev.data.humancellatlas.org/type/project/14.1.0/project'
      });
      expect(res).toBe('project');
    });

    it('should return concrete type for different domain type', () => {
      const res = pipe.transform({
        describedBy: 'https://schema.dev.data.humancellatlas.org/type/biomaterial/15.5.0/donor_organism'
      });
      expect(res).toBe('donor_organism');
    });

  });
});
