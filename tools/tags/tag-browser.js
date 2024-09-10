/* eslint-disable no-underscore-dangle */
import { LitElement, html, nothing } from 'https://da.live/nx/deps/lit/lit-core.min.js';
import getStyle from 'https://da.live/nx/utils/styles.js';

const ROOT_TAG_PATH = '/content/cq:tags';
const TAG_EXT = '.1.json';

const style = await getStyle(import.meta.url);

class DaTagBrowser extends LitElement {
  static properties = {
    aemRepo: { attribute: false },
    token: { attribute: false },
    _tags: { state: true },
  };

  constructor() {
    super();
    this._tags = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [style];
    if (this.aemRepo && this.token) this.getTags(`https://${this.aemRepo}${ROOT_TAG_PATH}${TAG_EXT}`);
  }

  async getTags(path) {
    const opts = { headers: { Authorization: `Bearer ${this.token}` } };
    const resp = await fetch(path, opts);
    if (!resp.ok) return;
    const json = await resp.json();
    const tags = Object.keys(json).reduce((acc, key) => {
      if (json[key]['jcr:primaryType'] === 'cq:Tag') {
        acc.push({
          path: `${path.replace(TAG_EXT, '')}/${key}${TAG_EXT}`,
          name: key,
          title: json[key]['jcr:title'] || key,
          details: json[key],
        });
      }
      return acc;
    }, []);
    this._tags = [...this._tags, tags];
  }

  handleTagClick(tag, idx) {
    this._tags = this._tags.toSpliced(idx + 1);
    this.getTags(tag.path);
  }

  renderTagGroup(group, idx) {
    return html`
      <ul class="da-tag-group-list">
        ${group.map((tag) => html`
          <li class="da-tag-group" @click=${() => this.handleTagClick(tag, idx)}>
            ${tag.title}
          </li>
        `)}
      </ul>
    `;
  }

  render() {
    if (this._tags.length === 0) return nothing;
    return html`
      <ul class="da-tag-groups">
        ${this._tags.map((group, idx) => html`
          <li class="da-tag-group">
            ${this.renderTagGroup(group, idx)}
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('da-tag-browser', DaTagBrowser);
