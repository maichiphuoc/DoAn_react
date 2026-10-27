import './App.css';
import Head from './component/Layout/Head';
import MenuLeft from './component/Layout/MenuLeft';
import Footer from './component/Layout/Footer';
import MenuAcc from './component/Layout/MenuAcc';
import MenuCart from './component/Layout/MenuCart'
import { useLocation } from 'react-router-dom';
import { AppProvider } from './component/Context/AppContext';

function App(props) {
  let params1 = useLocation();

    console.log(params1);
  const renderMenu = () => {
    if (params1.pathname.includes("account")) {
      return <MenuAcc />;
    }
    if (params1.pathname.includes("cart")) {
      return <MenuCart />;
    }
    return <MenuLeft />;
  };
  return (
    <>
        <AppProvider>
        <Head/>
              <section>
                <div className="container">
                    <div className="row">

                        {renderMenu()}

                        {props.children}

                    </div>
                </div>
            </section>
        <Footer/>
        </AppProvider>
    </>
  );
}

export default App;
