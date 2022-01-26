import React, {FC, useEffect, useState} from 'react'
import logo from './../assets/logo.svg'
import notification from './../assets/bell.png'
import user from './../assets/user.svg'
import search from './../assets/search.svg'
import menu from './../assets/menu.png'
import './Header.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
// import { getRequestToken } from '../api/api'
import { addUser } from '../features/userInfo/userInfoSlice'
import { userInfoSelector } from '../features/userInfo'

type IProps = {
    session: string,
    setToken: (token: string) => void
}

type SectionProps = {
    title: string
}

const ListSection: FC<SectionProps> = ({ children, title }) => (
    <li className="trigger_movies">
    <span className="p-[7px] hover:font-bold relative cursor-pointer">{title}</span>
        <div className="movies-menu text-[black] z-[1] bg-white w-[180px] border border-grey rounded-md">
            <ul className="flex flex-col py-[8px]">
                {children}
            </ul>
        </div>
    </li>
)

const SectionLink: FC = ({ children }) => (
    <li><a href="#" className="hover:bg-gray-300 block px-[20px] py-[3px]">{children}</a></li>
)

const Header: FC<IProps> = ({ session, setToken }) => {
    
    const [toggleMenu, setToggleMenu] = useState<boolean>(false);
    const dispatch = useDispatch()

    const userInfo = useSelector(userInfoSelector)

    // useEffect( () => {
    //     if(!session){
    //         getRequestToken().then(({data, error}) => {
    //             if (data) {
    //                 setToken(data)
    //             } else if (error) {
    //                 console.log(error)
    //             }
    //         });
    //     }
    // }, [session])

    const handleMenu = () => {
        setToggleMenu(!toggleMenu)
    }

    const handleDelete = async () => {
        if(session) 
            await axios.delete(`${process.env.REACT_APP_API_URL}/authentication/session?api_key=${process.env.REACT_APP_API_KEY}`, { data: {session_id: session}})
            dispatch(addUser({id: null, name: null}))
    }

    return (
        <header className="bg-[#032541] w-full h-[54px] flex relative lg:h-[64px]">
            <div className="w-[95%] m-auto px-[10px] md:w-[80%] lg:w-[70%]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-[104px] h-[20px] lg:w-[154px]">
                            <Link to='/'>
                                <img src={logo} alt="" />
                            </Link>
                        </div>
                        <div className="ml-[25px] hidden sm:block">
                            <ul className="text-white text-[15px] flex gap-[20px] lg:text-[16px]">
                                <ListSection title="Movies">
                                    <li><Link to='/movie' className="hover:bg-gray-300 block px-[20px] py-[3px]">Popular</Link></li>
                                    <SectionLink>Now Playing</SectionLink>
                                    <SectionLink>Upcoming</SectionLink>
                                    <SectionLink>Top Rated</SectionLink>
                                </ListSection>
                                <ListSection title="TV Shows">
                                    <SectionLink>Popular</SectionLink>
                                    <SectionLink>Airing Today</SectionLink>
                                    <SectionLink>On TV</SectionLink>
                                    <SectionLink>Top Rated</SectionLink>
                                </ListSection>
                                <ListSection title="People">
                                    <SectionLink>Popular People</SectionLink>
                                </ListSection>
                                <ListSection title="More">
                                    <SectionLink>Discussions</SectionLink>
                                    <SectionLink>Leaderboard</SectionLink>
                                    <SectionLink>Support</SectionLink>
                                    <SectionLink>API</SectionLink>
                                </ListSection>
                            </ul>
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <ul className="flex items-center gap-[20px]">
                            <li>
                                <a href="#"> <img src={notification} alt="" className="w-[24px] h-[24px] cur"/> </a>
                            </li>
                            {/* {userInfo.id == null ? <li>
                                <a href={`https://www.themoviedb.org/authenticate/${props.token}?redirect_to=http://localhost:3000/approved`}> <img src={user} alt="" className="w-[32px] h-[32px]" /> </a>
                            </li> : <span className="text-white relative account-menu-trigger p-[15px] cursor-pointer hover:underline">
                                {userInfo.name}
                                <div className="account-menu bg-white text-black z-[222] font-bold border border-grey rounded-md">
                                    <ul className="flex flex-col gap-[10px]">
                                        <li>
                                            <Link to={`/account/${userInfo.id}/favorites`} className="hover:bg-gray-300 block px-[20px] py-[3px] rounded-t-md">Favorites</Link>
                                        </li>
                                        <li>
                                            <span className="hover:bg-gray-300 block px-[20px] py-[3px]" onClick={handleDelete}>Log Out</span>
                                        </li>
                                    </ul>
                                    </div>
                                </span>} */}
                            <li>
                                <a href="#sdaa"> <img src={search} alt="" className="w-[32px] h-[32px]" /> </a>
                            </li>
                        </ul>
                    </div>
                    <div className="sm:hidden">
                        <img src={menu} alt="menu" className="w-[44px] h-[44px]" onClick={handleMenu}/>
                        {toggleMenu && <div className="absolute right-0 bg-[#032541] text-white w-[160px] z-[1]">
                                <ul>
                                    <li><a href="#">Movies</a></li>
                                    <li><a href="#">TV Shows</a></li>
                                    <li><a href="#">People</a></li>
                                    <li><a href="#">More</a></li>
                                    <li><a href="#">Notifications</a></li>
                                    <li><a href="#">Account</a></li>
                                </ul>
                            </div>}
                    </div>
                </div>
            </div>
            
        </header>
    )
}

export default Header
