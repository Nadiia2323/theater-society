import logonav from "../theater/nav-logo.jpg"
import active from "../theater/navigation-bar.png"
import "../Components/NavBar.css"
// import { Link } from 'react-router-dom';

// type MyObject = {
//   a: number;
//   j: string,
//   l?:number
// }
export default function NavBar() {

//   const [myvar, setmyvar] = useState<MyObject | null>(null)

// useEffect(() => {
// function myfetch() {
//   const theater:MyObject = {a:78,j:"fff"}
//   setmyvar(theater)
// }
// }, [])


  return (
    <div className="navbar-container">
      <div className="navbar-logo">
        {/* <Link to="/">  */}
        <img className="logo-img" src={logonav} alt="" />
          <p className="logo-name">StageConnect</p>
          {/* </Link> */}
      </div>
    <div className="navbar-signin-up">
          <img className="img-nav" src={active} alt="" />
          {/* <a href="#">Sign In</a>
          <p>||</p>
          <a href="">Sign Up</a> */}
      </div>
      
      </div>
      )
      
}
