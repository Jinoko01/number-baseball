interface ModalInterface {
  header?: React.ReactNode;
  body?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ header, body, actions, footer }: ModalInterface) {
  return (
    <div className='w-full h-full absolute bg-gray-200 opacity-70 flex items-center justify-center'>
      <main className='p-8 min-w-xs max-w-xl w-full min-h-72 flex flex-col items-center justify-between gap-4 border-2 border-gray-300 rounded-xl shadow-lg bg-white'>
        {header ? <header>{header}</header> : null}
        {body ? <div>{body}</div> : null}
        {actions ? <div>{actions}</div> : null}
        {footer ? <footer>{footer}</footer> : null}
      </main>
    </div>
  );
}
