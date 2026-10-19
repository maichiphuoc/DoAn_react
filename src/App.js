import logo from './logo.svg';
import './App.css';
import Head from './component/Layout/Head';
import MenuLeft from './component/Layout/MenuLeft';
import Footer from './component/Layout/Footer';
import MenuAcc from './component/Layout/MenuAcc';
import { useLocation } from 'react-router-dom';

function App(props) {
  let params1 = useLocation();

    console.log(params1);
  return (
    <>
        <Head/>
              <section>
                <div className="container">
                    <div className="row">

                        {params1.pathname.includes("account")
                            ? <MenuAcc />
                            : <MenuLeft />
                        }

                        {props.children}

                    </div>
                </div>
            </section>
        <Footer/>
    </>
  );
}

export default App;
