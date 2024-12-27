import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface TreeNode {
  label: string;
  checked: boolean;
  indeterminate: boolean;
  children?: TreeNode[];
}

@Component({
  standalone: true,
  selector: 'app-tree-checkbox',
  template: `
    @if (node.children && node.children.length > 0) {
      <details open>
        <summary>
          <input
            type="checkbox"
            [(ngModel)]="node.checked"
            [indeterminate]="node.indeterminate"
            (change)="onToggle(node)"
          />
          {{ node.label }}
        </summary>
        <div class="children">
          @for (child of node.children; track child.label) {
            <app-tree-checkbox [node]="child" [parent]="this" />
          }
        </div>
      </details>
    } @else {
      <div class="leaf">
        <input
          type="checkbox"
          [(ngModel)]="node.checked"
          (change)="onToggle(node)"
        />
        {{ node.label }}
      </div>
    }
  `,
  styles: [
    `
      .leaf {
        padding-left: 40px;
      }

      details {
        padding-left: 20px;
      }
    `,
  ],
  imports: [FormsModule],
})
export class CheckboxTreeComponent {
  @Input() node!: TreeNode;
  @Input() parent: CheckboxTreeComponent | null = null;

  onToggle(node: TreeNode) {
    this.toggleChildren(node, node.checked);
    this.updateIndeterminateState();
  }

  // Toggle all child checkboxes based on the parent checkbox state
  toggleChildren(node: TreeNode, checked: boolean) {
    if (node.children) {
      node.children.forEach((child) => {
        child.checked = checked;
        child.indeterminate = false;
        this.toggleChildren(child, checked);
      });
    }
  }

  // Update the indeterminate and checked states based on children
  updateIndeterminateState() {
    if (this.parent) {
      const parentNode = this.parent.node;
      if (parentNode.children) {
        const allChecked = parentNode.children.every((child) => child.checked);
        const noneChecked = parentNode.children.every(
          (child) => !child.checked && !child.indeterminate,
        );

        parentNode.checked = allChecked;
        parentNode.indeterminate = !allChecked && !noneChecked;

        // Recursively update ancestors
        this.parent.updateIndeterminateState();
      }
    }
  }
}
