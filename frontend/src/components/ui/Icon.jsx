const paths = {
  dashboard: 'M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-5H4v5Zm10 0h6v-7h-6v7Z',
  wallet: 'M4 7.5A2.5 2.5 0 0 1 6.5 5h10A2.5 2.5 0 0 1 19 7.5v1h-2v-1a.5.5 0 0 0-.5-.5h-10a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-1h2v1A2.5 2.5 0 0 1 16.5 19h-10A2.5 2.5 0 0 1 4 16.5v-9ZM13 10a2 2 0 1 1 0 4h7v-4h-7Z',
  expense: 'M5 5h14v2H5V5Zm0 6h14v2H5v-2Zm0 6h9v2H5v-2Z',
  income: 'M11 19V5l-4 4-1.4-1.4L12 1l6.4 6.6L17 9l-4-4v14h-2Z',
  budget: 'M4 6.5h16v11H4v-11Zm2 2v7h12v-7H6Zm2 10h8v2H8v-2Z',
  goal: 'm12 2 2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 15.8 6.8 18.3l1-5.9L3.5 8.2l5.9-.9L12 2Z',
  category: 'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 3.5 2.5 2.5 4.5-4.5-1.4-1.4-3.1 3.1-1.1-1.1-1.4 1.4Z',
  settings: 'M12 8.5A3.5 3.5 0 1 1 12 15.5 3.5 3.5 0 0 1 12 8.5Zm8 3-1.9-.6a6.7 6.7 0 0 0-.5-1.1l.9-1.8-1.9-1.9-1.8.9c-.3-.2-.7-.4-1.1-.5L12.5 4h-1l-.6 1.9c-.4.1-.8.3-1.1.5l-1.8-.9-1.9 1.9.9 1.8c-.2.3-.4.7-.5 1.1L4 11.5v1l1.9.6c.1.4.3.8.5 1.1l-.9 1.8 1.9 1.9 1.8-.9c.3.2.7.4 1.1.5l.6 1.9h1l.6-1.9c.4-.1.8-.3 1.1-.5l1.8.9 1.9-1.9-.9-1.8c.2-.3.4-.7.5-1.1l1.9-.6v-1Z',
  search: 'm15.5 14 5 5-1.5 1.5-5-5v-.8l-.3-.3a6.5 6.5 0 1 1 1.5-1.5l.3.3h.8ZM6 10.5A4.5 4.5 0 1 0 10.5 6 4.5 4.5 0 0 0 6 10.5Z',
  plus: 'M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4Z',
  bell: 'M12 22a2.8 2.8 0 0 1-2.6-2h5.2A2.8 2.8 0 0 1 12 22Zm7-3H5v-2l2-2v-4.5A5 5 0 0 1 11 5.6V5a1 1 0 1 1 2 0v.6A5 5 0 0 1 17 10.5V15l2 2v2Z',
  download: 'M11 4h2v8l2.8-2.8 1.4 1.4-5.2 5.2-5.2-5.2 1.4-1.4L11 12V4Zm-6 14h14v2H5v-2Z',
  filter: 'M4 6h16v2l-6 6v5l-4 2v-7L4 8V6Z',
  list: 'M5 6h14v2H5V6Zm0 5h14v2H5v-2Zm0 5h14v2H5v-2Z',
  grid: 'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z',
};

export default function Icon({ className = 'h-5 w-5', name }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d={paths[name] || paths.dashboard} />
    </svg>
  );
}
