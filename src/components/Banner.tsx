export const Banner = () => (
  <div className="flex items-center justify-center gap-x-6 bg-indigo-600 px-6 py-2.5 sm:px-3.5 ">
    <p className="text-sm leading-6 text-white">
      <span>
        <strong className="font-semibold">Versão BETA</strong>
        <svg
          viewBox="0 0 2 2"
          className="mx-2 inline h-0.5 w-0.5 fill-current"
          aria-hidden="true"
        >
          <circle cx={1} cy={1} r={1} />
        </svg>
        Relaxe e aproveite a fase beta. Erros são apenas uma parte natural da
        evolução. Nós cuidaremos deles.
      </span>
    </p>
  </div>
);
