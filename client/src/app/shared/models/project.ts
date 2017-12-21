export class Project {
  uuid : string;
  updateDate : string;
  content: Object;
}

export class ProjectContent {
  project_id: string;
  name: string;
  description: string;
  contributors: Contact[]
}

export class Contact {
  city: string;
  name: string;
  country: string;
  institution: string;
  address: string;
  email: string;
}
