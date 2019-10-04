import {Component, OnInit} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {ActivatedRoute} from "@angular/router";
import {IngestService} from "../shared/services/ingest.service";

/**
 * Json node data with nested structure. Each node has a name and a value or a list of children
 */
export class FieldNode {
  children: FieldNode[];
  name: string;
  value: any;
}
@Component({
  selector: 'app-metadata-detail',
  templateUrl: './metadata-detail.component.html',
  styleUrls: ['./metadata-detail.component.css']
})
export class MetadataDetailComponent implements OnInit {
  nestedTreeControl: NestedTreeControl<FieldNode>;
  nestedDataSource: MatTreeNestedDataSource<FieldNode>;

  uuid: string;
  type: string;
  json: any;

  constructor(private route: ActivatedRoute,
              private ingestService: IngestService) {
    this.nestedTreeControl = new NestedTreeControl<FieldNode>(node => node.children);
    this.nestedDataSource = new MatTreeNestedDataSource<FieldNode>();

    this.uuid = this.route.snapshot.paramMap.get('uuid');
    this.type = this.route.snapshot.paramMap.get('type');
    this.ingestService.getEntityByUuid(this.type, this.uuid).subscribe(
      json => {
        this.json = json;
        this.initialiseTree(json['content']);
      })

  }

  initialiseTree(data) {
    this.nestedDataSource.data = this.buildTree(data, 0);
  }

  ngOnInit() {
  }

  buildTree(obj: { [key: string]: any }, level: number): FieldNode[] {
    return Object.keys(obj).reduce<FieldNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FieldNode();
      node.name = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildTree(value, level + 1);
        } else {
          node.value = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  hasChild = (_: number, node: FieldNode) => !!node.children && node.children.length > 0;

}
