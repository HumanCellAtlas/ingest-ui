export class Account {
  id: string;
  name: string;
  providerReference: string;
  roles: string[];

  constructor(account: {
    id: string,
    providerReference: string,
    roles?: string[]
  }) {
    this.id = account.id;
    this.providerReference = account.providerReference;
    this.roles = account.roles;
  }

  isWrangler(): boolean {
    return this.roles.includes('WRANGLER');
  }
}
