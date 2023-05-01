import { css } from 'lit';

export const PlausibleStyles = css`
  .bg-red-50 {
    background-color: rgba(254, 242, 242, var(--tw-bg-opacity));
  }

  .bg-red-60 {
    background-color: rgba(254, 242, 242, var(--tw-bg-opacity));
  }

  .modal {
    display: none;
  }
  .modal.is-open {
    display: block;
  }
  .modal[aria-hidden='false'] .modal__overlay {
    animation: mmfadeIn 0.2s ease-in;
  }
  .modal[aria-hidden='true'] .modal__overlay {
    animation: mmfadeOut 0.2s ease-in;
  }
  .modal-enter {
    opacity: 0;
  }
  .modal-enter-active {
    opacity: 1;
    transition: opacity 0.1s ease-in;
  }
  .modal__overlay {
    background: rgba(0, 0, 0, 0.6);
    bottom: 0;
    left: 0;
    overflow-x: auto;
    overflow-y: auto;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 99;
  }
  .modal__container {
    background-color: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    margin: 50px auto;
    min-height: 509px;
    padding: 1rem 2rem;
    transition: height 0.2s ease-in;
  }
  .modal__close {
    color: #b8c2cc;
    font-size: 48px;
    font-weight: 700;
    position: fixed;
    right: 24px;
    top: 12px;
  }

  .modal__content {
    margin-bottom: 2rem;
  }
  @keyframes mmfadeIn {
    0% {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes mmfadeOut {
    0% {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  .loading {
    animation: loaderFadein 0.2s ease-in;
    height: 50px;
    width: 50px;
  }
  .loading.sm {
    height: 25px;
    width: 25px;
  }
  .loading div {
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
    border: 3px solid #dae1e7;
    border-radius: 50%;
    border-top-color: #606f7b;
    display: inline-block;
    height: 50px;
    width: 50px;
  }
  .dark .loading div {
    border: 3px solid #606f7b;
    border-top-color: #dae1e7;
  }
  .loading.sm div {
    height: 25px;
    width: 25px;
  }
  @keyframes loaderFadein {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  [tooltip] {
    display: inline-block;
    position: relative;
  }
  [tooltip]:before {
    border-color: #191e38 transparent transparent;
    border-style: solid;
    border-width: 4px 6px 0;
    content: '';
    transform: translateX(-50%);
  }
  [tooltip]:after,
  [tooltip]:before {
    left: 50%;
    opacity: 0;
    position: absolute;
    top: -6px;
    transition: 0.3s;
    z-index: 99;
  }
  [tooltip]:after {
    background: #191e38;
    border-radius: 3px;
    color: #fff;
    content: attr(tooltip);
    font-size: 0.875rem;
    max-width: 420px;
    min-width: 80px;
    padding: 4px 8px;
    pointer-events: none;
    text-align: center;
    transform: translateX(-50%) translateY(-100%);
    white-space: nowrap;
  }
  [tooltip]:hover:after,
  [tooltip]:hover:before {
    opacity: 1;
  }
  .flatpickr-calendar:after,
  .flatpickr-calendar:before {
    right: 22px !important;
  }
  .flatpickr-wrapper {
    right: 35% !important;
  }
  @media (max-width: 768px) {
    .flatpickr-wrapper {
      right: 50% !important;
    }
  }
  .dark .flatpickr-calendar {
    background-color: #1f2937;
  }
  .dark .flatpickr-weekday {
    color: #f3f4f6;
  }
  .dark .flatpickr-next-month,
  .dark .flatpickr-prev-month {
    fill: #f3f4f6 !important;
  }
  .dark .flatpickr-monthDropdown-months {
    color: #f3f4f6 !important;
  }
  .dark .numInputWrapper {
    color: #f3f4f6;
  }
  .dark .numInput[disabled] {
    color: #9ca3af !important;
  }
  .dark .flatpickr-current-month .numInputWrapper span.arrowUp:after {
    border-bottom-color: #f3f4f6 !important;
  }
  .dark .flatpickr-current-month .numInputWrapper span.arrowDown:after {
    border-top-color: #f3f4f6 !important;
  }
  .dark .flatpickr-day.prevMonthDay {
    color: #94a3af;
  }
  .dark .flatpickr-day {
    color: #e5e7eb;
  }
  .dark .flatpickr-day.nextMonthDay,
  .dark .flatpickr-day.prevMonthDay {
    color: #9ca3af;
  }
  .dark .flatpickr-day:hover,
  .dark :not(.startRange):not(.endRange).flatpickr-day.nextMonthDay:hover,
  .dark :not(.startRange):not(.endRange).flatpickr-day.prevMonthDay:hover {
    background-color: #374151;
  }
  .dark .flatpickr-next-month {
    fill: #f3f4f6;
  }
  .dark .flatpickr-day.flatpickr-disabled,
  .dark .flatpickr-day.flatpickr-disabled:hover {
    color: #4b5563;
  }
  .dark .flatpickr-day.today {
    background-color: rgba(167, 243, 208, 0.5);
    border-color: #34d399;
  }
  .dark .flatpickr-day.inRange,
  .dark .flatpickr-day.nextMonthDay.inRange,
  .dark .flatpickr-day.prevMonthDay.inRange {
    background-color: #374151;
    border-color: #374151;
    box-shadow: -5px 0 0 #374151, 5px 0 0 #374151;
  }
  .flatpickr-day.endRange,
  .flatpickr-day.startRange {
    background: #6574cd !important;
    border-color: #6574cd !important;
  }
  .dark .flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n + 1)),
  .flatpickr-day.endRange.startRange + .endRange:not(:nth-child(7n + 1)),
  .flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n + 1)),
  .flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n + 1)) {
    -webkit-box-shadow: -10px 0 0 #4556c3 !important;
    box-shadow: -10px 0 0 #4556c3 !important;
  }

  /*! tailwindcss v2.2.16 | MIT License | https://tailwindcss.com */

  /*! modern-normalize v1.1.0 | MIT License | https://github.com/sindresorhus/modern-normalize */
  html {
    -webkit-text-size-adjust: 100%;
    line-height: 1.15;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
  }
  body {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
      sans-serif, Apple Color Emoji, Segoe UI Emoji;
    margin: 0;
  }
  hr {
    color: inherit;
    height: 0;
  }
  abbr[title] {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }
  b,
  strong {
    font-weight: bolder;
  }
  code,
  kbd,
  pre,
  samp {
    font-family: ui-monospace, SFMono-Regular, Consolas, Liberation Mono, Menlo,
      monospace;
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  table {
    border-color: inherit;
    text-indent: 0;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }
  button,
  select {
    text-transform: none;
  }
  [type='button'],
  [type='reset'],
  [type='submit'],
  button {
    -webkit-appearance: button;
  }
  legend {
    padding: 0;
  }
  progress {
    vertical-align: baseline;
  }
  [type='search'] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }
  summary {
    display: list-item;
  }
  blockquote,
  dd,
  dl,
  figure,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  p,
  pre {
    margin: 0;
  }
  button {
    background-color: transparent;
    background-image: none;
  }
  fieldset,
  ol,
  ul {
    margin: 0;
    padding: 0;
  }
  ol,
  ul {
    list-style: none;
  }
  html {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
      Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
    line-height: 1.5;
  }
  body {
    font-family: inherit;
    line-height: inherit;
  }
  *,
  :after,
  :before {
    border: 0 solid;
    box-sizing: border-box;
  }
  hr {
    border-top-width: 1px;
  }
  img {
    border-style: solid;
  }
  textarea {
    resize: vertical;
  }
  input::-moz-placeholder,
  textarea::-moz-placeholder {
    color: #9ca3af;
  }
  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: #9ca3af;
  }
  input::placeholder,
  textarea::placeholder {
    color: #9ca3af;
  }
  [role='button'],
  button {
    cursor: pointer;
  }
  table {
    border-collapse: collapse;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    color: inherit;
    line-height: inherit;
    padding: 0;
  }
  code,
  kbd,
  pre,
  samp {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      Liberation Mono, Courier New, monospace;
  }
  audio,
  canvas,
  embed,
  iframe,
  img,
  object,
  svg,
  video {
    display: block;
    vertical-align: middle;
  }
  img,
  video {
    height: auto;
    max-width: 100%;
  }
  [hidden] {
    display: none;
  }
  *,
  :after,
  :before {
    --tw-border-opacity: 1;
    border-color: rgba(229, 231, 235, var(--tw-border-opacity));
  }
  [multiple],
  [type='date'],
  [type='email'],
  [type='month'],
  [type='number'],
  [type='password'],
  [type='search'],
  [type='text'],
  [type='time'],
  [type='url'],
  [type='week'],
  select,
  textarea {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    border-color: #6b7280;
    border-radius: 0;
    border-width: 1px;
    font-size: 1rem;
    line-height: 1.5rem;
    padding: 0.5rem 0.75rem;
  }
  [multiple]:focus,
  [type='date']:focus,
  [type='email']:focus,
  [type='month']:focus,
  [type='number']:focus,
  [type='password']:focus,
  [type='search']:focus,
  [type='text']:focus,
  [type='time']:focus,
  [type='url']:focus,
  [type='week']:focus,
  select:focus,
  textarea:focus {
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: #2563eb;
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    border-color: #2563eb;
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow, 0 0 #0000);
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  input::-moz-placeholder,
  textarea::-moz-placeholder {
    color: #6b7280;
    opacity: 1;
  }
  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: #6b7280;
    opacity: 1;
  }
  input::placeholder,
  textarea::placeholder {
    color: #6b7280;
    opacity: 1;
  }
  select {
    -webkit-print-color-adjust: exact;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    color-adjust: exact;
    padding-right: 2.5rem;
  }
  [multiple] {
    -webkit-print-color-adjust: unset;
    background-image: none;
    background-position: 0 0;
    background-repeat: unset;
    background-size: initial;
    color-adjust: unset;
    padding-right: 0.75rem;
  }
  [type='file'] {
    background: unset;
    border-color: inherit;
    border-radius: 0;
    border-width: 0;
    font-size: unset;
    line-height: inherit;
    padding: 0;
  }
  [type='file']:focus {
    outline: 1px auto -webkit-focus-ring-color;
  }
  .container {
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;
  }
  @media (min-width: 640px) {
    .container {
      max-width: 640px;
    }
  }
  @media (min-width: 768px) {
    .container {
      max-width: 768px;
    }
  }
  @media (min-width: 1024px) {
    .container {
      max-width: 1024px;
    }
  }
  @media (min-width: 1280px) {
    .container {
      max-width: 1280px;
    }
  }
  @media (min-width: 1536px) {
    .container {
      max-width: 1536px;
    }
  }
  [x-cloak] {
    display: none;
  }
  .button {
    --tw-bg-opacity: 1;
    background-color: rgba(79, 70, 229, var(--tw-bg-opacity));
    border-color: transparent;
    border-radius: 0.375rem;
    border-width: 1px;
    display: inline-flex;
    justify-content: center;
  }
  .button:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(67, 56, 202, var(--tw-bg-opacity));
  }
  .button {
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    padding: 0.5rem 1rem;
  }
  .button:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    --tw-ring-opacity: 1;
    --tw-ring-color: rgba(99, 102, 241, var(--tw-ring-opacity));
    --tw-ring-offset-width: 2px;
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow, 0 0 #0000);
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  .button {
    transition-duration: 0.15s;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter,
      -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition: all 0.1s ease-in;
  }
  .button[disabled] {
    --tw-bg-opacity: 1;
    background-color: rgba(156, 163, 175, var(--tw-bg-opacity));
  }
  .dark .button[disabled] {
    --tw-bg-opacity: 1;
    background-color: rgba(75, 85, 99, var(--tw-bg-opacity));
  }
  .button-outline {
    --tw-border-opacity: 1;
    --tw-text-opacity: 1;
    background-color: transparent;
    border-color: rgba(79, 70, 229, var(--tw-border-opacity));
    border-width: 1px;
    color: rgba(79, 70, 229, var(--tw-text-opacity));
  }
  .button-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .button-md,
  .button-sm {
    padding: 0.5rem 1rem;
  }
  html {
    --tw-text-opacity: 1;
    color: rgba(31, 41, 55, var(--tw-text-opacity));
  }
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  button:disabled {
    cursor: default;
  }
  blockquote {
    --tw-border-opacity: 1;
    border-color: rgba(107, 114, 128, var(--tw-border-opacity));
    border-left-width: 4px;
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
  }
  @media (min-width: 1280px) {
    .container {
      max-width: 70rem;
    }
  }
  .pricing-table {
    height: 920px;
  }
  @media (min-width: 768px) {
    .pricing-table {
      height: auto;
    }
  }
  .sr-only {
    clip: rect(0, 0, 0, 0);
    border-width: 0;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
  .pointer-events-none {
    pointer-events: none;
  }
  .pointer-events-auto {
    pointer-events: auto;
  }
  .invisible {
    visibility: hidden;
  }
  .static {
    position: static;
  }
  .fixed {
    position: fixed;
  }
  .absolute {
    position: absolute;
  }
  .relative {
    position: relative;
  }
  .sticky {
    position: sticky;
  }
  .inset-0 {
    left: 0;
    right: 0;
  }
  .inset-0,
  .inset-y-0 {
    bottom: 0;
    top: 0;
  }
  .top-0 {
    top: 0;
  }
  .-top-10 {
    top: -2.5rem;
  }
  .right-0 {
    right: 0;
  }
  .right-3 {
    right: 0.75rem;
  }
  .right-4 {
    right: 1rem;
  }
  .bottom-0 {
    bottom: 0;
  }
  .bottom-4 {
    bottom: 1rem;
  }
  .left-0 {
    left: 0;
  }
  .z-0 {
    z-index: 0;
  }
  .z-9 {
    z-index: 9;
  }
  .z-10 {
    z-index: 10;
  }
  .z-20 {
    z-index: 20;
  }
  .z-50 {
    z-index: 50;
  }
  .focus-within\:z-10:focus-within {
    z-index: 10;
  }
  .order-3 {
    order: 3;
  }
  .col-span-1 {
    grid-column: span 1 / span 1;
  }
  .col-span-4 {
    grid-column: span 4 / span 4;
  }
  .m-1 {
    margin: 0.25rem;
  }
  .m-2 {
    margin: 0.5rem;
  }
  .mx-2 {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }

  .my-1 {
    margin-bottom: 0.25rem;
    margin-top: 0.25rem;
  }
  .my-2 {
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }
  .my-3 {
    margin-bottom: 0.75rem;
    margin-top: 0.75rem;
  }
  .my-4 {
    margin-bottom: 1rem;
    margin-top: 1rem;
  }
  .my-6 {
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
  }
  .my-8 {
    margin-bottom: 2rem;
    margin-top: 2rem;
  }
  .my-12 {
    margin-bottom: 3rem;
    margin-top: 3rem;
  }
  .my-16 {
    margin-bottom: 4rem;
    margin-top: 4rem;
  }
  .my-32 {
    margin-bottom: 8rem;
    margin-top: 8rem;
  }
  .my-40 {
    margin-bottom: 10rem;
    margin-top: 10rem;
  }
  .my-44 {
    margin-bottom: 11rem;
    margin-top: 11rem;
  }
  .my-56 {
    margin-bottom: 14rem;
    margin-top: 14rem;
  }
  .-my-2 {
    margin-bottom: -0.5rem;
    margin-top: -0.5rem;
  }
  .-my-5 {
    margin-bottom: -1.25rem;
    margin-top: -1.25rem;
  }
  .mt-0 {
    margin-top: 0;
  }
  .mt-1 {
    margin-top: 0.25rem;
  }
  .mt-2 {
    margin-top: 0.5rem;
  }
  .mt-3 {
    margin-top: 0.75rem;
  }
  .mt-4 {
    margin-top: 1rem;
  }
  .mt-6 {
    margin-top: 1.5rem;
  }
  .mt-8 {
    margin-top: 2rem;
  }
  .mt-10 {
    margin-top: 2.5rem;
  }
  .mt-12 {
    margin-top: 3rem;
  }
  .mt-16 {
    margin-top: 4rem;
  }
  .mt-20 {
    margin-top: 5rem;
  }
  .mt-24 {
    margin-top: 6rem;
  }
  .mt-32 {
    margin-top: 8rem;
  }
  .mt-36 {
    margin-top: 9rem;
  }
  .mt-44 {
    margin-top: 11rem;
  }
  .mt-px {
    margin-top: 1px;
  }
  .mt-0\.5 {
    margin-top: 0.125rem;
  }
  .-mt-1 {
    margin-top: -0.25rem;
  }
  .-mt-2 {
    margin-top: -0.5rem;
  }
  .-mt-px {
    margin-top: -1px;
  }
  .mr-1 {
    margin-right: 0.25rem;
  }
  .mr-2 {
    margin-right: 0.5rem;
  }
  .mr-3 {
    margin-right: 0.75rem;
  }
  .mr-4 {
    margin-right: 1rem;
  }
  .mr-6 {
    margin-right: 1.5rem;
  }
  .mr-auto {
    margin-right: auto;
  }
  .mr-px {
    margin-right: 1px;
  }
  .-mr-1 {
    margin-right: -0.25rem;
  }
  .-mr-2 {
    margin-right: -0.5rem;
  }
  .mb-0 {
    margin-bottom: 0;
  }
  .mb-1 {
    margin-bottom: 0.25rem;
  }
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  .mb-4 {
    margin-bottom: 1rem;
  }
  .mb-6 {
    margin-bottom: 1.5rem;
  }
  .mb-12 {
    margin-bottom: 3rem;
  }
  .mb-24 {
    margin-bottom: 6rem;
  }
  .ml-0 {
    margin-left: 0;
  }
  .ml-1 {
    margin-left: 0.25rem;
  }
  .ml-2 {
    margin-left: 0.5rem;
  }
  .ml-3 {
    margin-left: 0.75rem;
  }
  .ml-4 {
    margin-left: 1rem;
  }
  .ml-6 {
    margin-left: 1.5rem;
  }
  .ml-auto {
    margin-left: auto;
  }
  .ml-px {
    margin-left: 1px;
  }
  .-ml-1 {
    margin-left: -0.25rem;
  }
  .-ml-px {
    margin-left: -1px;
  }
  .block {
    display: block;
  }
  .inline-block {
    display: inline-block;
  }
  .inline {
    display: inline;
  }
  .flex {
    display: flex;
  }
  .inline-flex {
    display: inline-flex;
  }
  .table {
    display: table;
  }
  .table-cell {
    display: table-cell;
  }
  .flow-root {
    display: flow-root;
  }
  .grid {
    display: grid;
  }
  .contents {
    display: contents;
  }
  .hidden {
    display: none;
  }
  .group:hover .group-hover\:block {
    display: block;
  }
  .dark .dark\:inline {
    display: inline;
  }
  .dark .dark\:hidden {
    display: none;
  }
  .h-0 {
    height: 0;
  }
  .h-2 {
    height: 0.5rem;
  }
  .h-3 {
    height: 0.75rem;
  }
  .h-4 {
    height: 1rem;
  }
  .h-5 {
    height: 1.25rem;
  }
  .h-6 {
    height: 1.5rem;
  }
  .h-8 {
    height: 2rem;
  }
  .h-12 {
    height: 3rem;
  }
  .h-32 {
    height: 8rem;
  }
  .h-full {
    height: 100%;
  }
  .max-h-60 {
    max-height: 15rem;
  }
  .min-h-screen {
    min-height: 100vh;
  }
  .w-0 {
    width: 0;
  }
  .w-2 {
    width: 0.5rem;
  }
  .w-3 {
    width: 0.75rem;
  }
  .w-4 {
    width: 1rem;
  }
  .w-5 {
    width: 1.25rem;
  }
  .w-6 {
    width: 1.5rem;
  }
  .w-8 {
    width: 2rem;
  }
  .w-11 {
    width: 2.75rem;
  }
  .w-12 {
    width: 3rem;
  }
  .w-20 {
    width: 5rem;
  }
  .w-24 {
    width: 6rem;
  }
  .w-32 {
    width: 8rem;
  }
  .w-36 {
    width: 9rem;
  }
  .w-48 {
    width: 12rem;
  }
  .w-56 {
    width: 14rem;
  }
  .w-64 {
    width: 16rem;
  }
  .w-72 {
    width: 18rem;
  }
  .w-auto {
    width: auto;
  }
  .w-1\/2 {
    width: 50%;
  }
  .w-2\/3 {
    width: 66.666667%;
  }
  .w-full {
    width: 100%;
  }
  .w-max {
    width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content;
  }
  .w-content {
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
  }
  .min-w-0 {
    min-width: 0;
  }
  .min-w-full {
    min-width: 100%;
  }
  .max-w-xs {
    max-width: 20rem;
  }
  .max-w-sm {
    max-width: 24rem;
  }
  .max-w-md {
    max-width: 28rem;
  }
  .max-w-lg {
    max-width: 32rem;
  }
  .max-w-xl {
    max-width: 36rem;
  }
  .max-w-2xl {
    max-width: 42rem;
  }
  .max-w-3xl {
    max-width: 48rem;
  }
  .max-w-4xl {
    max-width: 56rem;
  }
  .max-w-screen-lg {
    max-width: 1024px;
  }
  .max-w-2xs {
    max-width: 15rem;
  }
  .max-w-3xs {
    max-width: 12rem;
  }
  .flex-1 {
    flex: 1 1 0%;
  }
  .flex-shrink-0 {
    flex-shrink: 0;
  }
  .flex-grow {
    flex-grow: 1;
  }
  .table-fixed {
    table-layout: fixed;
  }
  .border-collapse {
    border-collapse: collapse;
  }
  .origin-top-right {
    transform-origin: top right;
  }
  .origin-top-left {
    transform-origin: top left;
  }
  .transform {
    --tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    transform: translateX(var(--tw-translate-x))
      translateY(var(--tw-translate-y)) rotate(var(--tw-rotate))
      skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
      scaleY(var(--tw-scale-y));
  }
  .translate-x-0 {
    --tw-translate-x: 0px;
  }
  .translate-x-5 {
    --tw-translate-x: 1.25rem;
  }
  .translate-y-0 {
    --tw-translate-y: 0px;
  }
  .translate-y-2 {
    --tw-translate-y: 0.5rem;
  }
  .translate-y-4 {
    --tw-translate-y: 1rem;
  }
  .scale-95 {
    --tw-scale-x: 0.95;
    --tw-scale-y: 0.95;
  }
  .scale-100 {
    --tw-scale-x: 1;
    --tw-scale-y: 1;
  }
  @-webkit-keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }
  @keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }
  @-webkit-keyframes ping {
    75%,
    to {
      opacity: 0;
      transform: scale(2);
    }
  }
  @keyframes ping {
    75%,
    to {
      opacity: 0;
      transform: scale(2);
    }
  }
  @-webkit-keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }
  @keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }
  @-webkit-keyframes bounce {
    0%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      transform: translateY(-25%);
    }
    50% {
      -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      transform: none;
    }
  }
  @keyframes bounce {
    0%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      transform: translateY(-25%);
    }
    50% {
      -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      transform: none;
    }
  }
  .animate-spin {
    -webkit-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
  }
  .cursor-default {
    cursor: default;
  }
  .cursor-pointer,
  .hover:\cursor-pointer:hover {
    cursor: pointer;
  }

  .cursor-pointer {
    cursor: pointer;
  }


  .cursor-pointer
  .select-none {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .resize-none {
    resize: none;
  }
  .resize {
    resize: both;
  }
  .list-disc {
    list-style-type: disc;
  }
  .appearance-none {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .flex-row {
    flex-direction: row;
  }
  .flex-col {
    flex-direction: column;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }
  .content-center {
    align-content: center;
  }
  .items-start {
    align-items: flex-start;
  }
  .items-end {
    align-items: flex-end;
  }
  .items-center {
    align-items: center;
  }
  .items-stretch {
    align-items: stretch;
  }
  .justify-start {
    justify-content: flex-start;
  }
  .justify-end {
    justify-content: flex-end;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-between {
    justify-content: space-between;
  }
  .gap-6 {
    gap: 1.5rem;
  }
  .gap-8 {
    gap: 2rem;
  }
  .space-x-2 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-left: calc(0.5rem * (1 - var(--tw-space-x-reverse)));
    margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  }
  .space-x-3 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-left: calc(0.75rem * (1 - var(--tw-space-x-reverse)));
    margin-right: calc(0.75rem * var(--tw-space-x-reverse));
  }
  .space-x-4 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-left: calc(1rem * (1 - var(--tw-space-x-reverse)));
    margin-right: calc(1rem * var(--tw-space-x-reverse));
  }
  .space-y-1 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
    margin-top: calc(0.25rem * (1 - var(--tw-space-y-reverse)));
  }
  .space-y-6 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));
    margin-top: calc(1.5rem * (1 - var(--tw-space-y-reverse)));
  }
  .-space-y-px > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-bottom: calc(-1px * var(--tw-space-y-reverse));
    margin-top: calc(-1px * (1 - var(--tw-space-y-reverse)));
  }
  .divide-y > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-y-reverse: 0;
    border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
    border-top-width: calc(1px * (1 - var(--tw-divide-y-reverse)));
  }
  .divide-gray-200 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 1;
    border-color: rgba(229, 231, 235, var(--tw-divide-opacity));
  }
  .dark .dark\:divide-gray-400 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 1;
    border-color: rgba(156, 163, 175, var(--tw-divide-opacity));
  }
  .dark .dark\:divide-gray-900 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 1;
    border-color: rgba(17, 24, 39, var(--tw-divide-opacity));
  }
  .self-start {
    align-self: flex-start;
  }
  .overflow-auto {
    overflow: auto;
  }
  .overflow-hidden {
    overflow: hidden;
  }
  .overflow-x-auto {
    overflow-x: auto;
  }
  .overflow-y-auto {
    overflow-y: auto;
  }
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .truncate,
  .whitespace-nowrap {
    white-space: nowrap;
  }
  .break-all {
    word-break: break-all;
  }
  .rounded-none {
    border-radius: 0;
  }
  .rounded {
    border-radius: 0.25rem;
  }
  .rounded-md {
    border-radius: 0.375rem;
  }
  .rounded-lg {
    border-radius: 0.5rem;
  }
  .rounded-full {
    border-radius: 9999px;
  }
  .rounded-t-none {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .rounded-r-none {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  .rounded-r {
    border-bottom-right-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }
  .rounded-r-md {
    border-bottom-right-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
  }
  .rounded-l-none {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
  .rounded-l {
    border-bottom-left-radius: 0.25rem;
    border-top-left-radius: 0.25rem;
  }
  .rounded-l-md {
    border-bottom-left-radius: 0.375rem;
  }
  .rounded-l-md,
  .rounded-tl-md {
    border-top-left-radius: 0.375rem;
  }
  .rounded-tr-md {
    border-top-right-radius: 0.375rem;
  }
  .rounded-br-md {
    border-bottom-right-radius: 0.375rem;
  }
  .rounded-bl-md {
    border-bottom-left-radius: 0.375rem;
  }
  .border-2 {
    border-width: 2px;
  }
  .border,
  .dark .dark\:border {
    border-width: 1px;
  }
  .border-t-2 {
    border-top-width: 2px;
  }
  .border-t {
    border-top-width: 1px;
  }
  .border-r-0 {
    border-right-width: 0;
  }
  .border-r {
    border-right-width: 1px;
  }
  .border-b {
    border-bottom-width: 1px;
  }
  .dark .dark\:border-t {
    border-top-width: 1px;
  }
  .dark .dark\:border-r {
    border-right-width: 1px;
  }
  .dark .dark\:border-l {
    border-left-width: 1px;
  }
  .border-none {
    border-style: none;
  }
  .border-transparent {
    border-color: transparent;
  }
  .border-gray-100 {
    --tw-border-opacity: 1;
    border-color: rgba(243, 244, 246, var(--tw-border-opacity));
  }
  .border-gray-200 {
    --tw-border-opacity: 1;
    border-color: rgba(229, 231, 235, var(--tw-border-opacity));
  }
  .border-gray-300 {
    --tw-border-opacity: 1;
    border-color: rgba(209, 213, 219, var(--tw-border-opacity));
  }
  .border-gray-400 {
    --tw-border-opacity: 1;
    border-color: rgba(156, 163, 175, var(--tw-border-opacity));
  }
  .border-red-600 {
    --tw-border-opacity: 1;
    border-color: rgba(220, 38, 38, var(--tw-border-opacity));
  }
  .border-yellow-200 {
    --tw-border-opacity: 1;
    border-color: rgba(253, 230, 138, var(--tw-border-opacity));
  }
  .border-green-300 {
    --tw-border-opacity: 1;
    border-color: rgba(110, 231, 183, var(--tw-border-opacity));
  }
  .border-green-500 {
    --tw-border-opacity: 1;
    border-color: rgba(16, 185, 129, var(--tw-border-opacity));
  }
  .border-blue-200 {
    --tw-border-opacity: 1;
    border-color: rgba(191, 219, 254, var(--tw-border-opacity));
  }
  .border-indigo-100 {
    --tw-border-opacity: 1;
    border-color: rgba(224, 231, 255, var(--tw-border-opacity));
  }
  .border-indigo-200 {
    --tw-border-opacity: 1;
    border-color: rgba(199, 210, 254, var(--tw-border-opacity));
  }
  .border-indigo-600 {
    --tw-border-opacity: 1;
    border-color: rgba(79, 70, 229, var(--tw-border-opacity));
  }
  .border-indigo-700 {
    --tw-border-opacity: 1;
    border-color: rgba(67, 56, 202, var(--tw-border-opacity));
  }
  .border-orange-200 {
    --tw-border-opacity: 1;
    border-color: rgba(254, 215, 170, var(--tw-border-opacity));
  }
  .hover\:border-gray-400:hover {
    --tw-border-opacity: 1;
    border-color: rgba(156, 163, 175, var(--tw-border-opacity));
  }
  .focus\:border-gray-300:focus {
    --tw-border-opacity: 1;
    border-color: rgba(209, 213, 219, var(--tw-border-opacity));
  }
  .focus\:border-gray-400:focus {
    --tw-border-opacity: 1;
    border-color: rgba(156, 163, 175, var(--tw-border-opacity));
  }
  .focus\:border-red-300:focus {
    --tw-border-opacity: 1;
    border-color: rgba(252, 165, 165, var(--tw-border-opacity));
  }
  .focus\:border-blue-300:focus {
    --tw-border-opacity: 1;
    border-color: rgba(147, 197, 253, var(--tw-border-opacity));
  }
  .focus\:border-indigo-500:focus {
    --tw-border-opacity: 1;
    border-color: rgba(99, 102, 241, var(--tw-border-opacity));
  }
  .focus\:border-indigo-700:focus {
    --tw-border-opacity: 1;
    border-color: rgba(67, 56, 202, var(--tw-border-opacity));
  }
  .dark .dark\:border-gray-500 {
    --tw-border-opacity: 1;
    border-color: rgba(107, 114, 128, var(--tw-border-opacity));
  }
  .dark .dark\:border-gray-700 {
    --tw-border-opacity: 1;
    border-color: rgba(55, 65, 81, var(--tw-border-opacity));
  }
  .dark .dark\:border-gray-900 {
    --tw-border-opacity: 1;
    border-color: rgba(17, 24, 39, var(--tw-border-opacity));
  }
  .dark .dark\:border-indigo-500 {
    --tw-border-opacity: 1;
    border-color: rgba(99, 102, 241, var(--tw-border-opacity));
  }
  .dark .dark\:border-indigo-800 {
    --tw-border-opacity: 1;
    border-color: rgba(55, 48, 163, var(--tw-border-opacity));
  }
  .dark .dark\:border-orange-200 {
    --tw-border-opacity: 1;
    border-color: rgba(254, 215, 170, var(--tw-border-opacity));
  }
  .dark .dark\:border-gray-850 {
    --tw-border-opacity: 1;
    border-color: rgba(26, 32, 44, var(--tw-border-opacity));
  }
  .dark .dark\:hover\:border-gray-200:hover {
    --tw-border-opacity: 1;
    border-color: rgba(229, 231, 235, var(--tw-border-opacity));
  }
  .dark .dark\:focus\:border-gray-500:focus {
    --tw-border-opacity: 1;
    border-color: rgba(107, 114, 128, var(--tw-border-opacity));
  }
  .bg-white {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
  }
  .bg-gray-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(249, 250, 251, var(--tw-bg-opacity));
  }
  .bg-gray-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  }
  .bg-gray-200 {
    --tw-bg-opacity: 1;
    background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
  }
  .bg-gray-300 {
    --tw-bg-opacity: 1;
    background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
  }
  .bg-gray-400 {
    --tw-bg-opacity: 1;
    background-color: rgba(156, 163, 175, var(--tw-bg-opacity));
  }
  .bg-gray-500 {
    --tw-bg-opacity: 1;
    background-color: rgba(107, 114, 128, var(--tw-bg-opacity));
  }
  .bg-gray-700 {
    --tw-bg-opacity: 1;
    background-color: rgba(55, 65, 81, var(--tw-bg-opacity));
  }
  .bg-gray-800 {
    --tw-bg-opacity: 1;
    background-color: rgba(31, 41, 55, var(--tw-bg-opacity));
  }
  .bg-red-40 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 247, 247, var(--tw-bg-opacity));
  }
  .bg-red-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 242, 242, var(--tw-bg-opacity));
  }
  .bg-red-60 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 232, 232, var(--tw-bg-opacity));
  }
  .bg-red-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 226, 226, var(--tw-bg-opacity));
  }
  .bg-red-500 {
    --tw-bg-opacity: 1;
    background-color: rgba(239, 68, 68, var(--tw-bg-opacity));
  }
  .bg-yellow-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 251, 235, var(--tw-bg-opacity));
  }
  .bg-yellow-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 243, 199, var(--tw-bg-opacity));
  }
  .bg-green-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(236, 253, 245, var(--tw-bg-opacity));
  }
  .bg-green-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(209, 250, 229, var(--tw-bg-opacity));
  }
  .bg-green-300 {
    --tw-bg-opacity: 1;
    background-color: rgba(110, 231, 183, var(--tw-bg-opacity));
  }
  .bg-blue-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(239, 246, 255, var(--tw-bg-opacity));
  }
  .bg-blue-200 {
    --tw-bg-opacity: 1;
    background-color: rgba(191, 219, 254, var(--tw-bg-opacity));
  }
  .bg-indigo-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(238, 242, 255, var(--tw-bg-opacity));
  }
  .bg-indigo-200 {
    --tw-bg-opacity: 1;
    background-color: rgba(199, 210, 254, var(--tw-bg-opacity));
  }
  .bg-indigo-600 {
    --tw-bg-opacity: 1;
    background-color: rgba(79, 70, 229, var(--tw-bg-opacity));
  }
  .bg-orange-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 247, 237, var(--tw-bg-opacity));
  }
  .odd\:bg-white:nth-child(odd) {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
  }
  .even\:bg-gray-50:nth-child(2n),
  .hover\:bg-gray-50:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(249, 250, 251, var(--tw-bg-opacity));
  }
  .hover\:bg-gray-100:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  }
  .hover\:bg-gray-200:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
  }
  .hover\:bg-gray-300:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
  }
  .hover\:bg-gray-600:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(75, 85, 99, var(--tw-bg-opacity));
  }
  .hover\:bg-gray-900:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(17, 24, 39, var(--tw-bg-opacity));
  }
  .hover\:bg-red-50:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 242, 242, var(--tw-bg-opacity));
  }
  .hover\:bg-red-600:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(220, 38, 38, var(--tw-bg-opacity));
  }
  .hover\:bg-indigo-500:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(99, 102, 241, var(--tw-bg-opacity));
  }
  .hover\:bg-indigo-700:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(67, 56, 202, var(--tw-bg-opacity));
  }
  .focus\:bg-white:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
  }
  .focus\:bg-gray-50:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(249, 250, 251, var(--tw-bg-opacity));
  }
  .focus\:bg-gray-100:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  }
  .focus\:bg-gray-200:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-transparent {
    background-color: transparent;
  }
  .dark .dark\:bg-gray-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-500 {
    --tw-bg-opacity: 1;
    background-color: rgba(107, 114, 128, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-600 {
    --tw-bg-opacity: 1;
    background-color: rgba(75, 85, 99, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-700 {
    --tw-bg-opacity: 1;
    background-color: rgba(55, 65, 81, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-800 {
    --tw-bg-opacity: 1;
    background-color: rgba(31, 41, 55, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-900 {
    --tw-bg-opacity: 1;
    background-color: rgba(17, 24, 39, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-red-200 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 202, 202, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-red-500 {
    --tw-bg-opacity: 1;
    background-color: rgba(239, 68, 68, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-yellow-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 243, 199, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-indigo-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(224, 231, 255, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-indigo-500 {
    --tw-bg-opacity: 1;
    background-color: rgba(99, 102, 241, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-950 {
    --tw-bg-opacity: 1;
    background-color: rgba(13, 18, 30, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-850 {
    --tw-bg-opacity: 1;
    background-color: rgba(26, 32, 44, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-825 {
    --tw-bg-opacity: 1;
    background-color: rgba(37, 47, 63, var(--tw-bg-opacity));
  }
  .dark .dark\:odd\:bg-gray-850:nth-child(odd) {
    --tw-bg-opacity: 1;
    background-color: rgba(26, 32, 44, var(--tw-bg-opacity));
  }
  .dark .dark\:even\:bg-gray-825:nth-child(2n) {
    --tw-bg-opacity: 1;
    background-color: rgba(37, 47, 63, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-gray-700:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(55, 65, 81, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-gray-800:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(31, 41, 55, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-gray-900:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(17, 24, 39, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-red-300:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(252, 165, 165, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-red-700:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(185, 28, 28, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-gray-850:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(26, 32, 44, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-gray-825:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(37, 47, 63, var(--tw-bg-opacity));
  }
  .dark .dark\:focus\:bg-gray-800:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(31, 41, 55, var(--tw-bg-opacity));
  }
  .dark .dark\:focus\:bg-gray-900:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(17, 24, 39, var(--tw-bg-opacity));
  }
  .bg-opacity-20 {
    --tw-bg-opacity: 0.2;
  }
  .bg-opacity-75 {
    --tw-bg-opacity: 0.75;
  }
  .dark .dark\:bg-opacity-15 {
    --tw-bg-opacity: 0.15;
  }
  .dark .dark\:bg-opacity-75 {
    --tw-bg-opacity: 0.75;
  }
  .fill-current {
    fill: currentColor;
  }
  .p-1 {
    padding: 0.25rem;
  }
  .p-2 {
    padding: 0.5rem;
  }
  .p-4 {
    padding: 1rem;
  }
  .p-8 {
    padding: 2rem;
  }
  .px-1 {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
  .px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .px-5 {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
  .px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  .px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .px-2\.5 {
    padding-left: 0.625rem;
    padding-right: 0.625rem;
  }
  .py-0 {
    padding-bottom: 0;
    padding-top: 0;
  }
  .py-1 {
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
  }
  .py-2 {
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
  }
  .py-3 {
    padding-bottom: 0.75rem;
    padding-top: 0.75rem;
  }
  .py-4 {
    padding-bottom: 1rem;
    padding-top: 1rem;
  }
  .py-5 {
    padding-bottom: 1.25rem;
    padding-top: 1.25rem;
  }
  .py-6 {
    padding-bottom: 1.5rem;
    padding-top: 1.5rem;
  }
  .py-8 {
    padding-bottom: 2rem;
    padding-top: 2rem;
  }
  .py-12 {
    padding-bottom: 3rem;
    padding-top: 3rem;
  }
  .py-0\.5 {
    padding-bottom: 0.125rem;
    padding-top: 0.125rem;
  }
  .py-1\.5 {
    padding-bottom: 0.375rem;
    padding-top: 0.375rem;
  }
  .pt-0 {
    padding-top: 0;
  }
  .pt-2 {
    padding-top: 0.5rem;
  }
  .pt-4 {
    padding-top: 1rem;
  }
  .pt-5 {
    padding-top: 1.25rem;
  }
  .pt-6 {
    padding-top: 1.5rem;
  }
  .pt-8 {
    padding-top: 2rem;
  }
  .pt-12 {
    padding-top: 3rem;
  }
  .pt-14 {
    padding-top: 3.5rem;
  }
  .pt-16 {
    padding-top: 4rem;
  }
  .pt-32 {
    padding-top: 8rem;
  }
  .pt-52 {
    padding-top: 13rem;
  }
  .pt-px {
    padding-top: 1px;
  }
  .pt-0\.5 {
    padding-top: 0.125rem;
  }
  .pr-1 {
    padding-right: 0.25rem;
  }
  .pr-2 {
    padding-right: 0.5rem;
  }
  .pr-4 {
    padding-right: 1rem;
  }
  .pr-6 {
    padding-right: 1.5rem;
  }
  .pr-9 {
    padding-right: 2.25rem;
  }
  .pr-10 {
    padding-right: 2.5rem;
  }
  .pr-16 {
    padding-right: 4rem;
  }
  .pb-1 {
    padding-bottom: 0.25rem;
  }
  .pb-4 {
    padding-bottom: 1rem;
  }
  .pb-5 {
    padding-bottom: 1.25rem;
  }
  .pb-8 {
    padding-bottom: 2rem;
  }
  .pb-20 {
    padding-bottom: 5rem;
  }
  .pl-1 {
    padding-left: 0.25rem;
  }
  .pl-2 {
    padding-left: 0.5rem;
  }
  .pl-3 {
    padding-left: 0.75rem;
  }
  .pl-8 {
    padding-left: 2rem;
  }
  .pl-10 {
    padding-left: 2.5rem;
  }
  .text-left {
    text-align: left;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
  .align-middle {
    vertical-align: middle;
  }
  .align-bottom {
    vertical-align: bottom;
  }
  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .text-base {
    font-size: 1rem;
    line-height: 1.5rem;
  }
  .text-lg {
    font-size: 1.125rem;
  }
  .text-lg,
  .text-xl {
    line-height: 1.75rem;
  }
  .text-xl {
    font-size: 1.25rem;
  }
  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  .text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  .text-5xl {
    font-size: 3rem;
    line-height: 1;
  }
  .font-normal {
    font-weight: 400;
  }
  .font-medium {
    font-weight: 500;
  }
  .font-semibold {
    font-weight: 600;
  }
  .font-bold {
    font-weight: 700;
  }
  .font-extrabold {
    font-weight: 800;
  }
  .font-black {
    font-weight: 900;
  }
  .uppercase {
    text-transform: uppercase;
  }
  .capitalize {
    text-transform: capitalize;
  }
  .italic {
    font-style: italic;
  }
  .leading-4 {
    line-height: 1rem;
  }
  .leading-5 {
    line-height: 1.25rem;
  }
  .leading-6 {
    line-height: 1.5rem;
  }
  .leading-7 {
    line-height: 1.75rem;
  }
  .leading-9 {
    line-height: 2.25rem;
  }
  .leading-none {
    line-height: 1;
  }
  .leading-tight {
    line-height: 1.25;
  }
  .leading-snug {
    line-height: 1.375;
  }
  .leading-normal {
    line-height: 1.5;
  }
  .tracking-tight {
    letter-spacing: -0.025em;
  }
  .tracking-wide {
    letter-spacing: 0.025em;
  }
  .tracking-wider {
    letter-spacing: 0.05em;
  }
  .tracking-widest {
    letter-spacing: 0.1em;
  }
  .text-black {
    --tw-text-opacity: 1;
    color: rgba(0, 0, 0, var(--tw-text-opacity));
  }
  .text-white {
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
  }
  .text-gray-50 {
    --tw-text-opacity: 1;
    color: rgba(249, 250, 251, var(--tw-text-opacity));
  }
  .text-gray-100 {
    --tw-text-opacity: 1;
    color: rgba(243, 244, 246, var(--tw-text-opacity));
  }
  .text-gray-300 {
    --tw-text-opacity: 1;
    color: rgba(209, 213, 219, var(--tw-text-opacity));
  }
  .text-gray-400 {
    --tw-text-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-text-opacity));
  }
  .text-gray-500 {
    --tw-text-opacity: 1;
    color: rgba(107, 114, 128, var(--tw-text-opacity));
  }
  .text-gray-600 {
    --tw-text-opacity: 1;
    color: rgba(75, 85, 99, var(--tw-text-opacity));
  }
  .text-gray-700 {
    --tw-text-opacity: 1;
    color: rgba(55, 65, 81, var(--tw-text-opacity));
  }
  .text-gray-800 {
    --tw-text-opacity: 1;
    color: rgba(31, 41, 55, var(--tw-text-opacity));
  }
  .text-gray-900 {
    --tw-text-opacity: 1;
    color: rgba(17, 24, 39, var(--tw-text-opacity));
  }
  .text-red-400 {
    --tw-text-opacity: 1;
    color: rgba(248, 113, 113, var(--tw-text-opacity));
  }
  .text-red-500 {
    --tw-text-opacity: 1;
    color: rgba(239, 68, 68, var(--tw-text-opacity));
  }
  .text-red-600 {
    --tw-text-opacity: 1;
    color: rgba(220, 38, 38, var(--tw-text-opacity));
  }
  .text-red-700 {
    --tw-text-opacity: 1;
    color: rgba(185, 28, 28, var(--tw-text-opacity));
  }
  .text-red-800 {
    --tw-text-opacity: 1;
    color: rgba(153, 27, 27, var(--tw-text-opacity));
  }
  .text-yellow-400 {
    --tw-text-opacity: 1;
    color: rgba(251, 191, 36, var(--tw-text-opacity));
  }
  .text-yellow-500 {
    --tw-text-opacity: 1;
    color: rgba(245, 158, 11, var(--tw-text-opacity));
  }
  .text-yellow-700 {
    --tw-text-opacity: 1;
    color: rgba(180, 83, 9, var(--tw-text-opacity));
  }
  .text-yellow-800 {
    --tw-text-opacity: 1;
    color: rgba(146, 64, 14, var(--tw-text-opacity));
  }
  .text-yellow-900 {
    --tw-text-opacity: 1;
    color: rgba(120, 53, 15, var(--tw-text-opacity));
  }
  .text-green-400 {
    --tw-text-opacity: 1;
    color: rgba(52, 211, 153, var(--tw-text-opacity));
  }
  .text-green-500 {
    --tw-text-opacity: 1;
    color: rgba(16, 185, 129, var(--tw-text-opacity));
  }
  .text-green-600 {
    --tw-text-opacity: 1;
    color: rgba(5, 150, 105, var(--tw-text-opacity));
  }
  .text-green-800 {
    --tw-text-opacity: 1;
    color: rgba(6, 95, 70, var(--tw-text-opacity));
  }
  .text-blue-500 {
    --tw-text-opacity: 1;
    color: rgba(59, 130, 246, var(--tw-text-opacity));
  }
  .text-blue-700 {
    --tw-text-opacity: 1;
    color: rgba(29, 78, 216, var(--tw-text-opacity));
  }
  .text-blue-900 {
    --tw-text-opacity: 1;
    color: rgba(30, 58, 138, var(--tw-text-opacity));
  }
  .text-indigo-500 {
    --tw-text-opacity: 1;
    color: rgba(99, 102, 241, var(--tw-text-opacity));
  }
  .text-indigo-600 {
    --tw-text-opacity: 1;
    color: rgba(79, 70, 229, var(--tw-text-opacity));
  }
  .text-indigo-700 {
    --tw-text-opacity: 1;
    color: rgba(67, 56, 202, var(--tw-text-opacity));
  }
  .text-indigo-800 {
    --tw-text-opacity: 1;
    color: rgba(55, 48, 163, var(--tw-text-opacity));
  }
  .text-indigo-900 {
    --tw-text-opacity: 1;
    color: rgba(49, 46, 129, var(--tw-text-opacity));
  }
  .text-pink-500 {
    --tw-text-opacity: 1;
    color: rgba(236, 72, 153, var(--tw-text-opacity));
  }
  .text-pink-600 {
    --tw-text-opacity: 1;
    color: rgba(219, 39, 119, var(--tw-text-opacity));
  }
  .text-orange-600 {
    --tw-text-opacity: 1;
    color: rgba(234, 88, 12, var(--tw-text-opacity));
  }
  .group:hover .group-hover\:text-white {
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
  }
  .group:hover .group-hover\:text-gray-100 {
    --tw-text-opacity: 1;
    color: rgba(243, 244, 246, var(--tw-text-opacity));
  }
  .group:hover .group-hover\:text-gray-600 {
    --tw-text-opacity: 1;
    color: rgba(75, 85, 99, var(--tw-text-opacity));
  }
  .group:hover .group-hover\:text-indigo-700 {
    --tw-text-opacity: 1;
    color: rgba(67, 56, 202, var(--tw-text-opacity));
  }
  .hover\:text-white:hover {
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
  }
  .hover\:text-gray-500:hover {
    --tw-text-opacity: 1;
    color: rgba(107, 114, 128, var(--tw-text-opacity));
  }
  .hover\:text-gray-900:hover {
    --tw-text-opacity: 1;
    color: rgba(17, 24, 39, var(--tw-text-opacity));
  }
  .hover\:text-red-500:hover {
    --tw-text-opacity: 1;
    color: rgba(239, 68, 68, var(--tw-text-opacity));
  }
  .hover\:text-red-900:hover {
    --tw-text-opacity: 1;
    color: rgba(127, 29, 29, var(--tw-text-opacity));
  }
  .hover\:text-indigo-500:hover {
    --tw-text-opacity: 1;
    color: rgba(99, 102, 241, var(--tw-text-opacity));
  }
  .hover\:text-indigo-600:hover {
    --tw-text-opacity: 1;
    color: rgba(79, 70, 229, var(--tw-text-opacity));
  }
  .hover\:text-indigo-700:hover {
    --tw-text-opacity: 1;
    color: rgba(67, 56, 202, var(--tw-text-opacity));
  }
  .hover\:text-indigo-900:hover {
    --tw-text-opacity: 1;
    color: rgba(49, 46, 129, var(--tw-text-opacity));
  }
  .focus\:text-gray-500:focus {
    --tw-text-opacity: 1;
    color: rgba(107, 114, 128, var(--tw-text-opacity));
  }
  .focus\:text-gray-900:focus {
    --tw-text-opacity: 1;
    color: rgba(17, 24, 39, var(--tw-text-opacity));
  }
  .dark .dark\:text-white {
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
  }
  .dark .dark\:text-gray-50 {
    --tw-text-opacity: 1;
    color: rgba(249, 250, 251, var(--tw-text-opacity));
  }
  .dark .dark\:text-gray-100 {
    --tw-text-opacity: 1;
    color: rgba(243, 244, 246, var(--tw-text-opacity));
  }
  .dark .dark\:text-gray-200 {
    --tw-text-opacity: 1;
    color: rgba(229, 231, 235, var(--tw-text-opacity));
  }
  .dark .dark\:text-gray-300 {
    --tw-text-opacity: 1;
    color: rgba(209, 213, 219, var(--tw-text-opacity));
  }
  .dark .dark\:text-gray-400 {
    --tw-text-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-text-opacity));
  }
  .dark .dark\:text-gray-500 {
    --tw-text-opacity: 1;
    color: rgba(107, 114, 128, var(--tw-text-opacity));
  }
  .dark .dark\:text-red-500 {
    --tw-text-opacity: 1;
    color: rgba(239, 68, 68, var(--tw-text-opacity));
  }
  .dark .dark\:text-red-800 {
    --tw-text-opacity: 1;
    color: rgba(153, 27, 27, var(--tw-text-opacity));
  }
  .dark .dark\:text-yellow-300 {
    --tw-text-opacity: 1;
    color: rgba(252, 211, 77, var(--tw-text-opacity));
  }
  .dark .dark\:text-yellow-400 {
    --tw-text-opacity: 1;
    color: rgba(251, 191, 36, var(--tw-text-opacity));
  }
  .dark .dark\:text-yellow-900 {
    --tw-text-opacity: 1;
    color: rgba(120, 53, 15, var(--tw-text-opacity));
  }
  .dark .dark\:text-blue-300 {
    --tw-text-opacity: 1;
    color: rgba(147, 197, 253, var(--tw-text-opacity));
  }
  .dark .dark\:text-indigo-400 {
    --tw-text-opacity: 1;
    color: rgba(129, 140, 248, var(--tw-text-opacity));
  }
  .dark .dark\:text-indigo-500 {
    --tw-text-opacity: 1;
    color: rgba(99, 102, 241, var(--tw-text-opacity));
  }
  .dark .group:hover .dark\:group-hover\:text-white {
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
  }
  .dark .group:hover .dark\:group-hover\:text-gray-400 {
    --tw-text-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-text-opacity));
  }
  .dark .group:hover .dark\:group-hover\:text-indigo-500 {
    --tw-text-opacity: 1;
    color: rgba(99, 102, 241, var(--tw-text-opacity));
  }
  .dark .dark\:hover\:text-gray-100:hover {
    --tw-text-opacity: 1;
    color: rgba(243, 244, 246, var(--tw-text-opacity));
  }
  .dark .dark\:hover\:text-gray-200:hover {
    --tw-text-opacity: 1;
    color: rgba(229, 231, 235, var(--tw-text-opacity));
  }
  .dark .dark\:hover\:text-gray-400:hover {
    --tw-text-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-text-opacity));
  }
  .dark .dark\:hover\:text-red-400:hover {
    --tw-text-opacity: 1;
    color: rgba(248, 113, 113, var(--tw-text-opacity));
  }
  .dark .dark\:hover\:text-indigo-500:hover {
    --tw-text-opacity: 1;
    color: rgba(99, 102, 241, var(--tw-text-opacity));
  }
  .dark .dark\:focus\:text-gray-100:focus {
    --tw-text-opacity: 1;
    color: rgba(243, 244, 246, var(--tw-text-opacity));
  }
  .dark .dark\:focus\:text-gray-200:focus {
    --tw-text-opacity: 1;
    color: rgba(229, 231, 235, var(--tw-text-opacity));
  }
  .underline {
    text-decoration: underline;
  }
  .line-through {
    text-decoration: line-through;
  }
  .no-underline {
    text-decoration: none;
  }
  .hover\:underline:hover {
    text-decoration: underline;
  }
  .dark .dark\:placeholder-gray-400::-moz-placeholder {
    --tw-placeholder-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-placeholder-opacity));
  }
  .dark .dark\:placeholder-gray-400:-ms-input-placeholder {
    --tw-placeholder-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-placeholder-opacity));
  }
  .dark .dark\:placeholder-gray-400::placeholder {
    --tw-placeholder-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-placeholder-opacity));
  }
  .opacity-0 {
    opacity: 0;
  }
  .opacity-25 {
    opacity: 0.25;
  }
  .opacity-75 {
    opacity: 0.75;
  }
  .opacity-100 {
    opacity: 1;
  }
  *,
  :after,
  :before {
    --tw-shadow: 0 0 #0000;
  }
  .shadow-sm {
    --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  .shadow,
  .shadow-sm {
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
  .shadow {
    --tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
  .shadow-md {
    --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .shadow-lg,
  .shadow-md {
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
  .shadow-lg {
    --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .shadow-xl {
    --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  .shadow-inner,
  .shadow-xl {
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
  .shadow-inner {
    --tw-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  }
  .group:hover .group-hover\:shadow-lg {
    --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .group:hover .group-hover\:shadow-lg,
  .hover\:shadow-none:hover {
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
  .hover\:shadow-none:hover {
    --tw-shadow: 0 0 #0000;
  }
  .focus\:outline-none:focus,
  .outline-none {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  *,
  :after,
  :before {
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgba(59, 130, 246, 0.5);
    --tw-ring-offset-shadow: 0 0 #0000;
    --tw-ring-shadow: 0 0 #0000;
  }
  .focus\:ring-1:focus,
  .ring-1 {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  }
  .focus\:ring-1:focus,
  .focus\:ring-2:focus,
  .ring-1 {
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow, 0 0 #0000);
  }
  .focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  }
  .focus\:ring:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow, 0 0 #0000);
  }
  .ring-black {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgba(0, 0, 0, var(--tw-ring-opacity));
  }
  .focus\:ring-gray-200:focus {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgba(229, 231, 235, var(--tw-ring-opacity));
  }
  .focus\:ring-gray-500:focus {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgba(107, 114, 128, var(--tw-ring-opacity));
  }
  .focus\:ring-indigo-500:focus {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgba(99, 102, 241, var(--tw-ring-opacity));
  }
  .focus\:ring-indigo-700:focus {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgba(67, 56, 202, var(--tw-ring-opacity));
  }
  .ring-opacity-5 {
    --tw-ring-opacity: 0.05;
  }
  .focus\:ring-offset-1:focus {
    --tw-ring-offset-width: 1px;
  }
  .focus\:ring-offset-2:focus {
    --tw-ring-offset-width: 2px;
  }
  .focus\:ring-offset-gray-100:focus {
    --tw-ring-offset-color: #f3f4f6;
  }
  .dark .dark\:focus\:ring-offset-gray-900:focus {
    --tw-ring-offset-color: #111827;
  }
  .filter {
    --tw-blur: var(--tw-empty, /*!*/ /*!*/);
    --tw-brightness: var(--tw-empty, /*!*/ /*!*/);
    --tw-contrast: var(--tw-empty, /*!*/ /*!*/);
    --tw-grayscale: var(--tw-empty, /*!*/ /*!*/);
    --tw-hue-rotate: var(--tw-empty, /*!*/ /*!*/);
    --tw-invert: var(--tw-empty, /*!*/ /*!*/);
    --tw-saturate: var(--tw-empty, /*!*/ /*!*/);
    --tw-sepia: var(--tw-empty, /*!*/ /*!*/);
    --tw-drop-shadow: var(--tw-empty, /*!*/ /*!*/);
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast)
      var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert)
      var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
  .transition-all {
    transition-duration: 0.15s;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition {
    transition-duration: 0.15s;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter,
      -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-colors {
    transition-duration: 0.15s;
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-opacity {
    transition-duration: 0.15s;
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-padding {
    transition-duration: 0.15s;
    transition-property: padding;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .duration-75 {
    transition-duration: 75ms;
  }
  .duration-100 {
    transition-duration: 0.1s;
  }
  .duration-150 {
    transition-duration: 0.15s;
  }
  .duration-200 {
    transition-duration: 0.2s;
  }
  .duration-300 {
    transition-duration: 0.3s;
  }
  .ease-in {
    transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  }
  .ease-out {
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  .ease-in-out {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .main-graph {
    height: 0;
    padding-top: calc(148px + 41.45221%);
    position: relative;
  }
  @media (min-width: 640px) {
    .main-graph {
      padding-top: calc(148px + 41.45221%);
    }
  }
  @media (min-width: 768px) {
    .main-graph {
      padding-top: calc(128px + 41.45221%);
    }
  }
  @media (min-width: 1024px) {
    .main-graph {
      padding-top: calc(18px + 41.45221%);
    }
  }
  .top-stats-only {
    height: 0;
    padding-top: 173px;
    position: relative;
  }
  @media (min-width: 640px) {
    .top-stats-only {
      padding-top: 170px;
    }
  }
  @media (min-width: 768px) {
    .top-stats-only {
      padding-top: 183px;
    }
  }
  @media (min-width: 1024px) {
    .top-stats-only {
      padding-top: 90px;
    }
  }

  .graph-inner {
    height: auto;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .light-text {
    color: #f0f4f8;
  }
  .transition {
    transition: all 0.1s ease-in;
  }
  .pulsating-circle {
    height: 10px;
    position: absolute;
    width: 10px;
    margin-top: 44px;
    margin-left: 127px;
  }
  .pulsating-circle:before {
    --tw-bg-opacity: 1;
    -webkit-animation: pulse-ring 3s cubic-bezier(0.215, 0.61, 0.355, 1)
      infinite;
    animation: pulse-ring 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    background-color: #9ae6b4;
    background-color: rgba(16, 185, 129, var(--tw-bg-opacity));
    border-radius: 45px;
    box-sizing: border-box;
    content: '';
    display: block;
    height: 300%;
    margin-left: -100%;
    margin-top: -100%;
    position: relative;
    width: 300%;
  }
  .pulsating-circle:after {
    --tw-bg-opacity: 1;
    -webkit-animation: pulse-dot 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s
      infinite;
    animation: pulse-dot 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
    background-color: #fff;
    background-color: rgba(16, 185, 129, var(--tw-bg-opacity));
    border-radius: 15px;
    content: '';
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
  @-webkit-keyframes pulse-ring {
    0% {
      transform: scale(0.33);
    }
    50% {
      transform: scale(1);
    }
    40%,
    to {
      opacity: 0;
    }
  }
  @keyframes pulse-ring {
    0% {
      transform: scale(0.33);
    }
    50% {
      transform: scale(1);
    }
    40%,
    to {
      opacity: 0;
    }
  }
  @-webkit-keyframes pulse-dot {
    0% {
      transform: scale(0.8);
    }
    25% {
      transform: scale(1);
    }
    50%,
    to {
      transform: scale(0.8);
    }
  }
  @keyframes pulse-dot {
    0% {
      transform: scale(0.8);
    }
    25% {
      transform: scale(1);
    }
    50%,
    to {
      transform: scale(0.8);
    }
  }
  .just-text h1,
  .just-text h2,
  .just-text h3 {
    margin-bottom: 0.5em;
    margin-top: 1em;
  }
  .just-text p {
    margin-bottom: 1rem;
    margin-top: 0;
  }
  .dropdown-content:before {
    border: 8px solid transparent;
    border-bottom-color: rgba(27, 31, 35, 0.15);
    left: auto;
    right: 8px;
    top: -16px;
  }
  .dropdown-content:after,
  .dropdown-content:before {
    content: '';
    display: inline-block;
    position: absolute;
  }
  .dropdown-content:after {
    border: 7px solid transparent;
    border-bottom-color: #fff;
    left: auto;
    right: 9px;
    top: -14px;
  }
  .feather,
  .feather-sm {
    display: inline;
    height: 1em;
    overflow: visible;
    width: 1em;
  }
  .table-striped tbody tr:nth-child(odd) {
    background-color: #f1f5f8;
  }
  .dark .table-striped tbody tr:nth-child(odd) {
    background-color: #252f3f;
  }
  .dark .table-striped tbody tr:nth-child(2n) {
    background-color: #1a202c;
  }
  .stats-item {
    min-height: 436px;
    min-width: 545px;
  }
  @media (min-width: 768px) {
    .stats-item {
      height: 27.25rem;
      margin-left: 6px;
      margin-right: 6px;
      min-height: auto;
      position: relative;
      width: calc(50% - 6px);
    }
    .stats-item-header {
      height: inherit;
    }
  }

  @media (max-width: 768px) {
    .stats-item {
      min-width: calc(100vw - 32px);
    }
  }

  .stats-item:first-child {
    margin-left: 0;
  }
  .stats-item:last-child {
    margin-right: 0;
  }
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
    transition: opacity 0.1s ease-in;
  }
  .flatpickr-calendar.static.open {
    right: 2px;
    top: 12px;
  }
  .datamaps-subunit {
    cursor: pointer;
  }
  .dark .hoverinfo {
    box-shadow: 1px 1px 5px #1a202c;
  }
  .fullwidth-shadow:before {
    --tw-bg-opacity: 1;
    background-color: rgba(249, 250, 251, var(--tw-bg-opacity));
    height: 100%;
    position: absolute;
    top: 0;
    width: 100vw;
  }
  .dark .fullwidth-shadow:before {
    --tw-bg-opacity: 1;
    background-color: rgba(26, 32, 44, var(--tw-bg-opacity));
  }
  .fullwidth-shadow:before {
    background-color: inherit;
    box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.06);
    content: '';
    left: calc(-50vw - -50%);
    z-index: -1;
  }
  .dark .fullwidth-shadow:before {
    box-shadow: 0 4px 2px -2px hsla(0, 0%, 78%, 0.1);
  }
  iframe[hidden] {
    display: none;
  }
  .pagination-link[disabled] {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
    cursor: default;
    pointer-events: none;
  }
  .dark .pagination-link[disabled] {
    --tw-bg-opacity: 1;
    background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
  }
  @media (max-width: 768px) {
    .flatpickr-wrapper {
      left: 0 !important;
      position: absolute !important;
      right: 0 !important;
    }
  }
  #chartjs-tooltip {
    background-color: #191e38;
    border-radius: 5px;
    font-size: 14px;
    font-style: normal;
    padding: 10px 12px;
    pointer-events: none;
    position: absolute;
    z-index: 100;
  }
  .active-prop-heading {
    -webkit-text-decoration-color: #4338ca;
    text-decoration-color: #4338ca;
    -webkit-text-decoration-line: underline;
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
  }
  @media (prefers-color-scheme: dark) {
    .active-prop-heading {
      -webkit-text-decoration-color: #6366f1;
      text-decoration-color: #6366f1;
    }
  }
  @media (min-width: 640px) {
    .sm\:order-2 {
      order: 2;
    }
    .sm\:col-span-2 {
      grid-column: span 2 / span 2;
    }
    .sm\:mx-0 {
      margin-left: 0;
      margin-right: 0;
    }
    .sm\:-mx-6 {
      margin-left: -1.5rem;
      margin-right: -1.5rem;
    }
    .sm\:my-0 {
      margin-bottom: 0;
      margin-top: 0;
    }
    .sm\:my-8 {
      margin-bottom: 2rem;
      margin-top: 2rem;
    }
    .sm\:mt-0 {
      margin-top: 0;
    }
    .sm\:mr-4 {
      margin-right: 1rem;
    }
    .sm\:mb-0 {
      margin-bottom: 0;
    }
    .sm\:ml-3 {
      margin-left: 0.75rem;
    }
    .sm\:ml-4 {
      margin-left: 1rem;
    }
    .sm\:block {
      display: block;
    }
    .sm\:inline-block {
      display: inline-block;
    }
    .sm\:flex {
      display: flex;
    }
    .sm\:hidden {
      display: none;
    }
    .sm\:h-10 {
      height: 2.5rem;
    }
    .sm\:h-screen {
      height: 100vh;
    }
    .sm\:w-10 {
      width: 2.5rem;
    }
    .sm\:w-36 {
      width: 9rem;
    }
    .sm\:w-auto {
      width: auto;
    }
    .sm\:w-full {
      width: 100%;
    }
    .sm\:max-w-xs {
      max-width: 20rem;
    }
    .sm\:max-w-lg {
      max-width: 32rem;
    }
    .sm\:translate-x-0 {
      --tw-translate-x: 0px;
    }
    .sm\:translate-x-2 {
      --tw-translate-x: 0.5rem;
    }
    .sm\:translate-y-0 {
      --tw-translate-y: 0px;
    }
    .sm\:scale-95 {
      --tw-scale-x: 0.95;
      --tw-scale-y: 0.95;
    }
    .sm\:scale-100 {
      --tw-scale-x: 1;
      --tw-scale-y: 1;
    }
    .sm\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .sm\:flex-row {
      flex-direction: row;
    }
    .sm\:flex-row-reverse {
      flex-direction: row-reverse;
    }
    .sm\:items-start {
      align-items: flex-start;
    }
    .sm\:justify-end {
      justify-content: flex-end;
    }
    .sm\:self-auto {
      align-self: auto;
    }
    .sm\:overflow-hidden,
    .sm\:truncate {
      overflow: hidden;
    }
    .sm\:truncate {
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sm\:rounded-md {
      border-radius: 0.375rem;
    }
    .sm\:rounded-lg {
      border-radius: 0.5rem;
    }
    .sm\:p-0 {
      padding: 0;
    }
    .sm\:p-3 {
      padding: 0.75rem;
    }
    .sm\:p-6 {
      padding: 1.5rem;
    }
    .sm\:px-2 {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
    .sm\:px-6 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    .sm\:px-8 {
      padding-left: 2rem;
      padding-right: 2rem;
    }
    .sm\:py-2 {
      padding-bottom: 0.5rem;
      padding-top: 0.5rem;
    }
    .sm\:py-3 {
      padding-bottom: 0.75rem;
      padding-top: 0.75rem;
    }
    .sm\:py-6 {
      padding-bottom: 1.5rem;
      padding-top: 1.5rem;
    }
    .sm\:pt-14 {
      padding-top: 3.5rem;
    }
    .sm\:pt-36 {
      padding-top: 9rem;
    }
    .sm\:pt-56 {
      padding-top: 14rem;
    }
    .sm\:pb-4 {
      padding-bottom: 1rem;
    }
    .sm\:pl-2 {
      padding-left: 0.5rem;
    }
    .sm\:pl-6 {
      padding-left: 1.5rem;
    }
    .sm\:text-left {
      text-align: left;
    }
    .sm\:align-middle {
      vertical-align: middle;
    }
    .sm\:text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .sm\:text-3xl {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    .sm\:text-4xl {
      font-size: 2.25rem;
      line-height: 2.5rem;
    }
    .sm\:leading-5 {
      line-height: 1.25rem;
    }
    .sm\:leading-9 {
      line-height: 2.25rem;
    }
    .sm\:leading-10 {
      line-height: 2.5rem;
    }
  }
  @media (min-width: 768px) {
    .md\:absolute {
      position: absolute;
    }
    .md\:relative {
      position: relative;
    }
    .md\:inset-y-0 {
      bottom: 0;
      top: 0;
    }
    .md\:top-auto {
      top: auto;
    }
    .md\:right-0 {
      right: 0;
    }
    .md\:bottom-0 {
      bottom: 0;
    }
    .md\:left-0 {
      left: 0;
    }
    .md\:left-auto {
      left: auto;
    }
    .md\:mt-0 {
      margin-top: 0;
    }
    .md\:mr-2 {
      margin-right: 0.5rem;
    }
    .md\:ml-2 {
      margin-left: 0.5rem;
    }
    .md\:block {
      display: block;
    }
    .md\:flex {
      display: flex;
    }

    .md\:grid {
      display: grid;
    }
    .md\:h-4 {
      height: 1rem;
    }
    .md\:h-5 {
      height: 1.25rem;
    }
    .md\:w-4 {
      width: 1rem;
    }
    .md\:w-5 {
      width: 1.25rem;
    }
    .md\:w-48 {
      width: 12rem;
    }
    .md\:w-56 {
      width: 14rem;
    }
    .md\:w-72 {
      width: 18rem;
    }
    .md\:w-full {
      width: 100%;
    }
    .md\:max-w-xs {
      max-width: 20rem;
    }
    .md\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .md\:flex-row {
      flex-direction: row;
    }
    .md\:justify-center {
      justify-content: center;
    }
    .md\:gap-8 {
      gap: 2rem;
    }
    .md\:truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .md\:px-3 {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
    .md\:px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .md\:px-6 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    .md\:pt-0 {
      padding-top: 0;
    }
    .md\:pt-48 {
      padding-top: 12rem;
    }
    .md\:pt-60 {
      padding-top: 15rem;
    }
    .md\:pb-3 {
      padding-bottom: 0.75rem;
    }
    .md\:text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .md\:text-lg {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }
    .md\:text-2xl {
      font-size: 1.5rem;
      line-height: 2rem;
    }
  }
  @media (min-width: 1024px) {
    .lg\:col-span-3 {
      grid-column: span 3 / span 3;
    }
    .lg\:col-span-9 {
      grid-column: span 9 / span 9;
    }
    .lg\:-mx-8 {
      margin-left: -2rem;
      margin-right: -2rem;
    }
    .lg\:mt-0 {
      margin-top: 0;
    }
    .lg\:mt-4 {
      margin-top: 1rem;
    }
    .lg\:block {
      display: block;
    }
    .lg\:flex {
      display: flex;
    }
    .lg\:grid {
      display: grid;
    }
    .lg\:hidden {
      display: none;
    }
    .lg\:w-auto {
      width: auto;
    }
    .lg\:w-1\/2 {
      width: 50%;
    }
    .lg\:w-1\/3 {
      width: 33.333333%;
    }
    .lg\:flex-shrink-0 {
      flex-shrink: 0;
    }
    .lg\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .lg\:grid-cols-12 {
      grid-template-columns: repeat(12, minmax(0, 1fr));
    }
    .lg\:items-center {
      align-items: center;
    }
    .lg\:justify-between {
      justify-content: space-between;
    }
    .lg\:gap-x-5 {
      -moz-column-gap: 1.25rem;
      column-gap: 1.25rem;
    }
    .lg\:truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .lg\:border-r-0 {
      border-right-width: 0;
    }
    .lg\:border-l {
      border-left-width: 1px;
    }
    .lg\:px-8 {
      padding-left: 2rem;
      padding-right: 2rem;
    }
    .lg\:py-16 {
      padding-bottom: 4rem;
      padding-top: 4rem;
    }
    .lg\:pt-5 {
      padding-top: 1.25rem;
    }
  }
  @media (min-width: 1280px) {
    .xl\:col-span-2 {
      grid-column: span 2 / span 2;
    }
    .xl\:my-0 {
      margin-bottom: 0;
      margin-top: 0;
    }
    .xl\:grid {
      display: grid;
    }
    .xl\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .xl\:gap-8 {
      gap: 2rem;
    }
  }
  .flatpickr-calendar {
    -webkit-animation: none;
    animation: none;
    background: transparent;
    background: #fff;
    border: 0;
    border-radius: 5px;
    -webkit-box-shadow: 1px 0 0 #e6e6e6, -1px 0 0 #e6e6e6, 0 1px 0 #e6e6e6,
      0 -1px 0 #e6e6e6, 0 3px 13px rgba(0, 0, 0, 0.08);
    box-shadow: 1px 0 0 #e6e6e6, -1px 0 0 #e6e6e6, 0 1px 0 #e6e6e6,
      0 -1px 0 #e6e6e6, 0 3px 13px rgba(0, 0, 0, 0.08);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    direction: ltr;
    display: none;
    font-size: 14px;
    line-height: 24px;
    opacity: 0;
    padding: 0;
    position: absolute;
    text-align: center;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    visibility: hidden;
    width: 307.875px;
  }
  .flatpickr-calendar.inline,
  .flatpickr-calendar.open {
    max-height: 640px;
    opacity: 1;
    visibility: visible;
  }
  .flatpickr-calendar.open {
    display: inline-block;
    z-index: 99999;
  }
  .flatpickr-calendar.animate.open {
    -webkit-animation: fpFadeInDown 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    animation: fpFadeInDown 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .flatpickr-calendar.inline {
    display: block;
    position: relative;
    top: 2px;
  }
  .flatpickr-calendar.static {
    position: absolute;
    top: calc(100% + 2px);
  }
  .flatpickr-calendar.static.open {
    display: block;
    z-index: 999;
  }
  .flatpickr-calendar.multiMonth
    .flatpickr-days
    .dayContainer:nth-child(n + 1)
    .flatpickr-day.inRange:nth-child(7n + 7) {
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }
  .flatpickr-calendar.multiMonth
    .flatpickr-days
    .dayContainer:nth-child(n + 2)
    .flatpickr-day.inRange:nth-child(7n + 1) {
    -webkit-box-shadow: -2px 0 0 #e6e6e6, 5px 0 0 #e6e6e6;
    box-shadow: -2px 0 0 #e6e6e6, 5px 0 0 #e6e6e6;
  }
  .flatpickr-calendar .hasTime .dayContainer,
  .flatpickr-calendar .hasWeeks .dayContainer {
    border-bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .flatpickr-calendar .hasWeeks .dayContainer {
    border-left: 0;
  }
  .flatpickr-calendar.hasTime .flatpickr-time {
    border-top: 1px solid #e6e6e6;
    height: 40px;
  }
  .flatpickr-calendar.noCalendar.hasTime .flatpickr-time {
    height: auto;
  }
  .flatpickr-calendar:after,
  .flatpickr-calendar:before {
    border: solid transparent;
    content: '';
    display: block;
    height: 0;
    left: 22px;
    pointer-events: none;
    position: absolute;
    width: 0;
  }
  .flatpickr-calendar.arrowRight:after,
  .flatpickr-calendar.arrowRight:before,
  .flatpickr-calendar.rightMost:after,
  .flatpickr-calendar.rightMost:before {
    left: auto;
    right: 22px;
  }
  .flatpickr-calendar.arrowCenter:after,
  .flatpickr-calendar.arrowCenter:before {
    left: 50%;
    right: 50%;
  }
  .flatpickr-calendar:before {
    border-width: 5px;
    margin: 0 -5px;
  }
  .flatpickr-calendar:after {
    border-width: 4px;
    margin: 0 -4px;
  }
  .flatpickr-calendar.arrowTop:after,
  .flatpickr-calendar.arrowTop:before {
    bottom: 100%;
  }
  .flatpickr-calendar.arrowTop:before {
    border-bottom-color: #e6e6e6;
  }
  .flatpickr-calendar.arrowTop:after {
    border-bottom-color: #fff;
  }
  .flatpickr-calendar.arrowBottom:after,
  .flatpickr-calendar.arrowBottom:before {
    top: 100%;
  }
  .flatpickr-calendar.arrowBottom:before {
    border-top-color: #e6e6e6;
  }
  .flatpickr-calendar.arrowBottom:after {
    border-top-color: #fff;
  }
  .flatpickr-calendar:focus {
    outline: 0;
  }
  .flatpickr-wrapper {
    display: inline-block;
    position: relative;
  }
  .flatpickr-months {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .flatpickr-months .flatpickr-month {
    fill: rgba(0, 0, 0, 0.9);
    -webkit-box-flex: 1;
    background: transparent;
    color: rgba(0, 0, 0, 0.9);
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 34px;
    line-height: 1;
    overflow: hidden;
    position: relative;
    text-align: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .flatpickr-months .flatpickr-next-month,
  .flatpickr-months .flatpickr-prev-month {
    fill: rgba(0, 0, 0, 0.9);
    color: rgba(0, 0, 0, 0.9);
    cursor: pointer;
    height: 34px;
    padding: 10px;
    position: absolute;
    text-decoration: none;
    top: 0;
    z-index: 3;
  }
  .flatpickr-months .flatpickr-next-month.flatpickr-disabled,
  .flatpickr-months .flatpickr-prev-month.flatpickr-disabled {
    display: none;
  }
  .flatpickr-months .flatpickr-next-month i,
  .flatpickr-months .flatpickr-prev-month i {
    position: relative;
  }
  .flatpickr-months .flatpickr-next-month.flatpickr-prev-month,
  .flatpickr-months .flatpickr-prev-month.flatpickr-prev-month {
    left: 0;
  }
  .flatpickr-months .flatpickr-next-month.flatpickr-next-month,
  .flatpickr-months .flatpickr-prev-month.flatpickr-next-month {
    right: 0;
  }
  .flatpickr-months .flatpickr-next-month:hover,
  .flatpickr-months .flatpickr-prev-month:hover {
    color: #959ea9;
  }
  .flatpickr-months .flatpickr-next-month:hover svg,
  .flatpickr-months .flatpickr-prev-month:hover svg {
    fill: #f64747;
  }
  .flatpickr-months .flatpickr-next-month svg,
  .flatpickr-months .flatpickr-prev-month svg {
    height: 14px;
    width: 14px;
  }
  .flatpickr-months .flatpickr-next-month svg path,
  .flatpickr-months .flatpickr-prev-month svg path {
    fill: inherit;
    -webkit-transition: fill 0.1s;
    transition: fill 0.1s;
  }
  .numInputWrapper {
    height: auto;
    position: relative;
  }
  .numInputWrapper input,
  .numInputWrapper span {
    display: inline-block;
  }
  .numInputWrapper input {
    width: 100%;
  }
  .numInputWrapper input::-ms-clear {
    display: none;
  }
  .numInputWrapper input::-webkit-inner-spin-button,
  .numInputWrapper input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .numInputWrapper span {
    border: 1px solid rgba(57, 57, 57, 0.15);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
    height: 50%;
    line-height: 50%;
    opacity: 0;
    padding: 0 4px 0 2px;
    position: absolute;
    right: 0;
    width: 14px;
  }
  .numInputWrapper span:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  .numInputWrapper span:active {
    background: rgba(0, 0, 0, 0.2);
  }
  .numInputWrapper span:after {
    content: '';
    display: block;
    position: absolute;
  }
  .numInputWrapper span.arrowUp {
    border-bottom: 0;
    top: 0;
  }
  .numInputWrapper span.arrowUp:after {
    border-bottom: 4px solid rgba(57, 57, 57, 0.6);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    top: 26%;
  }
  .numInputWrapper span.arrowDown {
    top: 50%;
  }
  .numInputWrapper span.arrowDown:after {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid rgba(57, 57, 57, 0.6);
    top: 40%;
  }
  .numInputWrapper span svg {
    height: auto;
    width: inherit;
  }
  .numInputWrapper span svg path {
    fill: rgba(0, 0, 0, 0.5);
  }
  .numInputWrapper:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  .numInputWrapper:hover span {
    opacity: 1;
  }
  .flatpickr-current-month {
    color: inherit;
    display: inline-block;
    font-size: 135%;
    font-weight: 300;
    height: 34px;
    left: 12.5%;
    line-height: inherit;
    line-height: 1;
    padding: 7.48px 0 0;
    position: absolute;
    text-align: center;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    width: 75%;
  }
  .flatpickr-current-month span.cur-month {
    color: inherit;
    display: inline-block;
    font-family: inherit;
    font-weight: 700;
    margin-left: 0.5ch;
    padding: 0;
  }
  .flatpickr-current-month span.cur-month:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  .flatpickr-current-month .numInputWrapper {
    display: inline-block;
    width: 6ch;
    width: 7ch\0;
  }
  .flatpickr-current-month .numInputWrapper span.arrowUp:after {
    border-bottom-color: rgba(0, 0, 0, 0.9);
  }
  .flatpickr-current-month .numInputWrapper span.arrowDown:after {
    border-top-color: rgba(0, 0, 0, 0.9);
  }
  .flatpickr-current-month input.cur-year {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
    background: transparent;
    border: 0;
    border-radius: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: inherit;
    cursor: text;
    display: inline-block;
    font-family: inherit;
    font-size: inherit;
    font-weight: 300;
    height: auto;
    line-height: inherit;
    margin: 0;
    padding: 0 0 0 0.5ch;
    vertical-align: initial;
  }
  .flatpickr-current-month input.cur-year:focus {
    outline: 0;
  }
  .flatpickr-current-month input.cur-year[disabled],
  .flatpickr-current-month input.cur-year[disabled]:hover {
    background: transparent;
    color: rgba(0, 0, 0, 0.5);
    font-size: 100%;
    pointer-events: none;
  }
  .flatpickr-current-month .flatpickr-monthDropdown-months {
    appearance: menulist;
    -webkit-appearance: menulist;
    -moz-appearance: menulist;
    background: transparent;
    border: none;
    border-radius: 0;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    color: inherit;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    font-weight: 300;
    height: auto;
    line-height: inherit;
    margin: -1px 0 0;
    outline: none;
    padding: 0 0 0 0.5ch;
    position: relative;
    vertical-align: initial;
    width: auto;
  }
  .flatpickr-current-month .flatpickr-monthDropdown-months:active,
  .flatpickr-current-month .flatpickr-monthDropdown-months:focus {
    outline: none;
  }
  .flatpickr-current-month .flatpickr-monthDropdown-months:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  .flatpickr-current-month
    .flatpickr-monthDropdown-months
    .flatpickr-monthDropdown-month {
    background-color: transparent;
    outline: none;
    padding: 0;
  }
  .flatpickr-weekdays {
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    background: transparent;
    height: 28px;
    overflow: hidden;
    text-align: center;
    width: 100%;
  }
  .flatpickr-weekdays,
  .flatpickr-weekdays .flatpickr-weekdaycontainer {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .flatpickr-weekdays .flatpickr-weekdaycontainer,
  span.flatpickr-weekday {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  span.flatpickr-weekday {
    background: transparent;
    color: rgba(0, 0, 0, 0.54);
    cursor: default;
    display: block;
    font-size: 90%;
    font-weight: bolder;
    line-height: 1;
    margin: 0;
    text-align: center;
  }
  .dayContainer,
  .flatpickr-weeks {
    padding: 1px 0 0;
  }
  .flatpickr-days {
    -webkit-box-align: start;
    -ms-flex-align: start;
    -webkit-align-items: flex-start;
    align-items: flex-start;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    overflow: hidden;
    position: relative;
    width: 307.875px;
  }
  .flatpickr-days:focus {
    outline: 0;
  }
  .dayContainer {
    -ms-flex-pack: justify;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-block;
    display: -ms-flexbox;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    -webkit-justify-content: space-around;
    justify-content: space-around;
    max-width: 307.875px;
    min-width: 307.875px;
    opacity: 1;
    outline: 0;
    padding: 0;
    text-align: left;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    width: 307.875px;
  }
  .dayContainer + .dayContainer {
    -webkit-box-shadow: -1px 0 0 #e6e6e6;
    box-shadow: -1px 0 0 #e6e6e6;
  }
  .flatpickr-day {
    -ms-flex-preferred-size: 14.2857143%;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    background: none;
    border: 1px solid transparent;
    border-radius: 150px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #393939;
    cursor: pointer;
    display: inline-block;
    -webkit-flex-basis: 14.2857143%;
    flex-basis: 14.2857143%;
    font-weight: 400;
    height: 39px;
    -webkit-justify-content: center;
    justify-content: center;
    line-height: 39px;
    margin: 0;
    max-width: 39px;
    position: relative;
    text-align: center;
    width: 14.2857143%;
  }
  .flatpickr-day.inRange,
  .flatpickr-day.nextMonthDay.inRange,
  .flatpickr-day.nextMonthDay.today.inRange,
  .flatpickr-day.nextMonthDay:focus,
  .flatpickr-day.nextMonthDay:hover,
  .flatpickr-day.prevMonthDay.inRange,
  .flatpickr-day.prevMonthDay.today.inRange,
  .flatpickr-day.prevMonthDay:focus,
  .flatpickr-day.prevMonthDay:hover,
  .flatpickr-day.today.inRange,
  .flatpickr-day:focus,
  .flatpickr-day:hover {
    background: #e6e6e6;
    border-color: #e6e6e6;
    cursor: pointer;
    outline: 0;
  }
  .flatpickr-day.today {
    border-color: #959ea9;
  }
  .flatpickr-day.today:focus,
  .flatpickr-day.today:hover {
    background: #959ea9;
    border-color: #959ea9;
    color: #fff;
  }
  .flatpickr-day.endRange,
  .flatpickr-day.endRange.inRange,
  .flatpickr-day.endRange.nextMonthDay,
  .flatpickr-day.endRange.prevMonthDay,
  .flatpickr-day.endRange:focus,
  .flatpickr-day.endRange:hover,
  .flatpickr-day.selected,
  .flatpickr-day.selected.inRange,
  .flatpickr-day.selected.nextMonthDay,
  .flatpickr-day.selected.prevMonthDay,
  .flatpickr-day.selected:focus,
  .flatpickr-day.selected:hover,
  .flatpickr-day.startRange,
  .flatpickr-day.startRange.inRange,
  .flatpickr-day.startRange.nextMonthDay,
  .flatpickr-day.startRange.prevMonthDay,
  .flatpickr-day.startRange:focus,
  .flatpickr-day.startRange:hover {
    background: #569ff7;
    border-color: #569ff7;
    -webkit-box-shadow: none;
    box-shadow: none;
    color: #fff;
  }
  .flatpickr-day.endRange.startRange,
  .flatpickr-day.selected.startRange,
  .flatpickr-day.startRange.startRange {
    border-radius: 50px 0 0 50px;
  }
  .flatpickr-day.endRange.endRange,
  .flatpickr-day.selected.endRange,
  .flatpickr-day.startRange.endRange {
    border-radius: 0 50px 50px 0;
  }
  .flatpickr-day.endRange.startRange + .endRange:not(:nth-child(7n + 1)),
  .flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n + 1)),
  .flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n + 1)) {
    -webkit-box-shadow: -10px 0 0 #569ff7;
    box-shadow: -10px 0 0 #569ff7;
  }
  .flatpickr-day.endRange.startRange.endRange,
  .flatpickr-day.selected.startRange.endRange,
  .flatpickr-day.startRange.startRange.endRange {
    border-radius: 50px;
  }
  .flatpickr-day.inRange {
    border-radius: 0;
    -webkit-box-shadow: -5px 0 0 #e6e6e6, 5px 0 0 #e6e6e6;
    box-shadow: -5px 0 0 #e6e6e6, 5px 0 0 #e6e6e6;
  }
  .flatpickr-day.flatpickr-disabled,
  .flatpickr-day.flatpickr-disabled:hover,
  .flatpickr-day.nextMonthDay,
  .flatpickr-day.notAllowed,
  .flatpickr-day.notAllowed.nextMonthDay,
  .flatpickr-day.notAllowed.prevMonthDay,
  .flatpickr-day.prevMonthDay {
    background: transparent;
    border-color: transparent;
    color: rgba(57, 57, 57, 0.3);
    cursor: default;
  }
  .flatpickr-day.flatpickr-disabled,
  .flatpickr-day.flatpickr-disabled:hover {
    color: rgba(57, 57, 57, 0.1);
    cursor: not-allowed;
  }
  .flatpickr-day.week.selected {
    border-radius: 0;
    -webkit-box-shadow: -5px 0 0 #569ff7, 5px 0 0 #569ff7;
    box-shadow: -5px 0 0 #569ff7, 5px 0 0 #569ff7;
  }
  .flatpickr-day.hidden {
    visibility: hidden;
  }
  .rangeMode .flatpickr-day {
    margin-top: 1px;
  }
  .flatpickr-weekwrapper {
    float: left;
  }
  .flatpickr-weekwrapper .flatpickr-weeks {
    -webkit-box-shadow: 1px 0 0 #e6e6e6;
    box-shadow: 1px 0 0 #e6e6e6;
    padding: 0 12px;
  }
  .flatpickr-weekwrapper .flatpickr-weekday {
    float: none;
    line-height: 28px;
    width: 100%;
  }
  .flatpickr-weekwrapper span.flatpickr-day,
  .flatpickr-weekwrapper span.flatpickr-day:hover {
    background: transparent;
    border: none;
    color: rgba(57, 57, 57, 0.3);
    cursor: default;
    display: block;
    max-width: none;
    width: 100%;
  }
  .flatpickr-innerContainer {
    display: block;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    overflow: hidden;
  }
  .flatpickr-innerContainer,
  .flatpickr-rContainer {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .flatpickr-rContainer {
    display: inline-block;
    padding: 0;
  }
  .flatpickr-time {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    height: 0;
    line-height: 40px;
    max-height: 40px;
    outline: 0;
    overflow: hidden;
    text-align: center;
  }
  .flatpickr-time:after {
    clear: both;
    content: '';
    display: table;
  }
  .flatpickr-time .numInputWrapper {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    float: left;
    height: 40px;
    width: 40%;
  }
  .flatpickr-time .numInputWrapper span.arrowUp:after {
    border-bottom-color: #393939;
  }
  .flatpickr-time .numInputWrapper span.arrowDown:after {
    border-top-color: #393939;
  }
  .flatpickr-time.hasSeconds .numInputWrapper {
    width: 26%;
  }
  .flatpickr-time.time24hr .numInputWrapper {
    width: 49%;
  }
  .flatpickr-time input {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
    background: transparent;
    border: 0;
    border-radius: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #393939;
    font-size: 14px;
    height: inherit;
    line-height: inherit;
    margin: 0;
    padding: 0;
    position: relative;
    text-align: center;
  }
  .flatpickr-time input.flatpickr-hour {
    font-weight: 700;
  }
  .flatpickr-time input.flatpickr-minute,
  .flatpickr-time input.flatpickr-second {
    font-weight: 400;
  }
  .flatpickr-time input:focus {
    border: 0;
    outline: 0;
  }
  .flatpickr-time .flatpickr-am-pm,
  .flatpickr-time .flatpickr-time-separator {
    -ms-flex-item-align: center;
    -webkit-align-self: center;
    align-self: center;
    color: #393939;
    float: left;
    font-weight: 700;
    height: inherit;
    line-height: inherit;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 2%;
  }
  .flatpickr-time .flatpickr-am-pm {
    cursor: pointer;
    font-weight: 400;
    outline: 0;
    text-align: center;
    width: 18%;
  }
  .flatpickr-time .flatpickr-am-pm:focus,
  .flatpickr-time .flatpickr-am-pm:hover,
  .flatpickr-time input:focus,
  .flatpickr-time input:hover {
    background: #eee;
  }
  .flatpickr-input[readonly] {
    cursor: pointer;
  }
  @-webkit-keyframes fpFadeInDown {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -20px, 0);
      transform: translate3d(0, -20px, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }
  @keyframes fpFadeInDown {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -20px, 0);
      transform: translate3d(0, -20px, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }
`;
