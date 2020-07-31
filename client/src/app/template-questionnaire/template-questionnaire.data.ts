import * as answerKey from './answer-key.json';

const answers = (answerKey as any).default;

export interface QuestionnaireData {
  technologyType: string[];
  libraryPreparation: string[];
  identifyingOrganisms: string[];
  specimenType: string[];
  experimentInfo: string;
}

export interface TypeSpec {
  schemaName: string;
  includeModules: string[];
  embedProcess: boolean;
  linkSpec: {
    linkEntities: string[];
    linkProtocols: string[]
  };
}

export class TemplateSpecification {

  private types = new Map<String, TypeSpec>();

  static convert(data: QuestionnaireData): TemplateSpecification {
    let specification = new TemplateSpecification();
    let recordInfo: boolean = 'experimentInfo' in data && data.experimentInfo.toLowerCase() == 'yes';
    for (let field in data) {
      if (!(field in answers)) continue;
      let answerSection = answers[field];
      data[field]
        .filter(value => value in answerSection)
        .forEach(value => {
          answers[field][value].forEach((ts: TypeSpec) => {
            if (specification.types.has(ts.schemaName)) {
              TemplateSpecification.merge(specification.types.get(ts.schemaName), ts);
            } else {
              //cloning to ensure the source object doesn't get overwritten by merges
              let clone = Object.assign({}, ts);
              clone.embedProcess = 'category' in clone && clone['category'] == 'biomaterial' ? recordInfo : false;
              delete clone['category'];
              specification.types.set(ts.schemaName, clone);
            }
          });
        });
    }
    return specification;
  }

  private static merge(spec: TypeSpec, other: TypeSpec): void {
    if (spec.schemaName == other.schemaName) {
      let unique = new Set<string>(spec.includeModules);
      other.includeModules.forEach(it => unique.add(it));
      spec.includeModules = [...unique];
    }
  }

  public getTypes(): TypeSpec[] {
    return [...this.types.values()];
  }

}
