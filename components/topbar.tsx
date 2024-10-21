export default function TopBar({username}:any) {
    return (
      <>
        {/* External CSS */}
        <link
          rel="stylesheet"
          href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"
        />
        <link
          rel="stylesheet"
          href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
        />
  
        <nav className="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-blueGray-800">
          <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
            <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
              <a
                className="text-sam font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
                href="#"
              >
                Hi {username}
              </a>
              {/* <button
                className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                type="button"
                onClick={() => toggleNavbar('example-collapse-navbar')}
              >jkerfnj
                <i className="text-white fas fa-bars"></i>
              </button> */}
            </div>
            <div
              className="lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none hidden bg-blueGray-800"
              id="example-collapse-navbar"
            >
              <ul className="flex flex-col lg:flex-row list-none mr-auto">
                <li className="flex items-center">
                  <a
                    className="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                    href="https://www.creative-tim.com/learning-lab/tailwind/js/overview/notus?ref=njs-register"
                  >
                    <i className="lg:text-blueGray-200 text-blueGray-400 far fa-file-alt text-lg leading-lg mr-2"></i>
                    Docs
                  </a>
                </li>
              </ul>
              <ul className="flex flex-col lg:flex-row list-none lg:ml-auto items-center">
                {/* Additional Menu Items */}
                {/* <li className="flex items-center">
                  <a
                    className="bg-white text-blueGray-700 active:bg-blueGray-50 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    href="https://www.creative-tim.com/product/notus-js?ref=njs-index"
                    target="_blank"
                  >
                    <i className="fas fa-arrow-alt-circle-down"></i> Download
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
        </nav>
  
        <footer className="relative pt-8 pb-6 mt-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center md:justify-between justify-center">
              <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                <div className="text-sm text-blueGray-500 font-semibold py-1">
                  Made with{' '}
                  <a
                    href="https://www.creative-tim.com/product/notus-js"
                    className="text-blueGray-500 hover:text-gray-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Notus JS
                  </a>{' '}
                  by{' '}
                  <a
                    href="https://www.creative-tim.com"
                    className="text-blueGray-500 hover:text-blueGray-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Creative Tim
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  }
  