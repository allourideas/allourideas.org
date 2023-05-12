import { directive } from 'lit/directive.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { marked } from 'marked';
import sanitizeHTML from 'sanitize-html';
marked.setOptions({
  // Enable table support
  gfm: true,
});
type Options = typeof MarkdownDirective.defaultOptions;

/**
 * An async directive to render markdown in a LitElement's render function.
 * Images can be included or removed in the executor's options.
 */
export class MarkdownDirective extends AsyncDirective {
  static defaultOptions = {
    includeImages: false,
    includeCodeBlockClassNames: false,
    loadingHTML: '<p>Loading...</p>',
    skipSanitization: false,
  };

  private sanitizeHTMLWithOptions(rawHTML: string, options: Options): string {
    return rawHTML;
    /*   const allowedTags = options.includeImages
      ? [...sanitizeHTML.defaults.allowedTags, "img"]
      : sanitizeHTML.defaults.allowedTags;
    const allowedClasses: sanitizeHTML.IOptions["allowedClasses"] = options.includeCodeBlockClassNames
      ? { code: ["*"] }
      : {};
    return sanitizeHTML(rawHTML, { allowedTags, allowedClasses });*/
  }

  private closeCodeBlockIfNeeded(rawMarkdown: string): string {
    const codeBlockDelimiterCount = (rawMarkdown.match(new RegExp('```', 'g')) || []).length;

    // If there is an odd number of code block delimiters, add one to close the last code block
    if (codeBlockDelimiterCount % 2 !== 0) {
      rawMarkdown += "\n```";
    }

    return rawMarkdown;
  }

  private removeCitations(rawMarkdown: string): string {
    const regex = /<code>(.*?)<\/code>/g;

    const output = rawMarkdown.replace(regex, (match, p1) => {
      const innerRegex = /<span class="postCitation">(\d+)<\/span>/g;
      const cleanedContent = p1.replace(innerRegex, '');
      return `<code>${cleanedContent}</code>`;
    });

    return output;
  }

  render(rawMarkdown: string, options?: Partial<Options>) {
    const mergedOptions = Object.assign(
      MarkdownDirective.defaultOptions,
      options ?? {}
    );

    rawMarkdown = this.closeCodeBlockIfNeeded(rawMarkdown);
    //rawMarkdown = this.removeCitations(rawMarkdown);

    new Promise<string>((resolve, reject) => {
      marked.parse(rawMarkdown, (error: any, result: any) => {
        if (error) return reject(error);

        const cssStyles = `
          table {
            border-collapse: collapse;
            border-radius: 5px;
            background-color: var(--md-sys-color-primary-container);
            color: var(--md-sys-color-on-primary-container);
            margin: 16px;
            width: 100%;
          }

          img {
            width: 200px;
            height: 113px;
            object-fit: cover;
          }


          ol {
            margin: 8px;
          }

          @media (max-width: 800px) {
            ol {
              padding: 0px;
            }
          }

          th, td {
            padding: 8px;
            text-align: left;
            vertical-align: top;
          }

          th {
            font-weight: bold;
            background-color: var(--md-sys-color-primary-container);
            color: var(--md-sys-color-on-primary-container);
          }

          tr:nth-child(even) {
          }

          tr:hover {
          }

          p {
            margin-top: 8px;
            margin-bottom: 8px;
          }

          pre {
            white-space: pre-wrap;
            white-space: -moz-pre-wrap;
          }
        `;

        // Combine the CSS styles with the generated HTML
        let formattedMarkdown = `
            <style>
            ${cssStyles}
          </style>
          ${result}
        `;

        resolve(formattedMarkdown);
      });
    })
      .then(rawHTML => {
        if (mergedOptions.skipSanitization) {
          return Promise.resolve(rawHTML);
        }
        return Promise.resolve(
          this.sanitizeHTMLWithOptions(rawHTML, mergedOptions)
        );
      })
      .then(preparedHTML => {
        let renderedHTML = unsafeHTML(preparedHTML);

        this.setValue(renderedHTML);
      });

    const placeholderHTML = mergedOptions.skipSanitization
      ? mergedOptions.loadingHTML
      : this.sanitizeHTMLWithOptions(mergedOptions.loadingHTML, mergedOptions);
    return unsafeHTML(placeholderHTML);
  }
}

/**
 * An asyn directive used to render markedown in a LitElement's render function.
 *
 * Rendering pictures can be enabled through the settings.
 * Css class names for code blocks may also be enabled through settings.
 *
 * setting the "skipSanitization" option to true will skip the sanitization process and render markdown as raw HTML.
 * _Use with caution!_
 *
 * The default loading html may also be replaced.
 * This default HTML is also sanitized by default.
 * If the "skipSanitization" option is true, the default HTML will also not be sanitized.
 *
 * @example render() {
 *            const rawMarkdown = `# Hello World`
 *            return html`<article>${resolveMarkdown(rawMarkdown)}</article>`
 * }
 *
 * @example render() {
 *            const rawMarkdown = `# Hello World
 *            ![image.jpeg](https://host.com/image.jpeg "image.jpeg")`;
 *            return html`<article>${resolveMarkdown(rawMarkdown, { includeImages: true, includeCodeBlockClassNames: true, loadingHTML: "<loading-icon></loading-icon>" })}</article>`
 * }
 * @typedef {Parameters<InstanceType<typeof MarkdownDirective>['render']>} RenderParameters
 * @param {RenderParameters[0]} rawMarkdown Markdown to be rendered.
 * @param {RenderParameters[1]} options
 */
export const resolveMarkdown = directive(MarkdownDirective);
