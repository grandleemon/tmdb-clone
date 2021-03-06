import moment from 'moment';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { movieApi } from '../../../api';
import { MovieDetailsTypes } from '../../../models/movie/movieTypes';
import { userInfoSelector } from '../../../store/features/userInfo';
import { userSessionSelector } from '../../../store/features/userSession';
import blank from './../../../assets/blank-icon.png'
import heart from './../../../assets/heart.png'
import loader from './../../../assets/loader.gif'
import CrewCreditDetails from './CrewCreditDetails';

type IProps = {
    movieDetails: MovieDetailsTypes
}

const basicImageUrl = "https://image.tmdb.org/t/p/original/"

const MovieInfo: FC<IProps> = ({movieDetails}) => {
    const [popupSuccess, setPopupSuccess] = useState<boolean>(false)
    const [popupError, setPopupError] = useState<boolean>(false)
    const { id } = useParams<{id?:string}>()
    const userInfo = useSelector(userInfoSelector)
    const session = useSelector(userSessionSelector)

    const calcTime = (time: number) => {
        if(time){
            const hours = Math.floor(time / 60)
            const minutes = time % 60
            const newTime = `${hours}h ${minutes}m`
            return newTime
        }
    }

    const addToFavorite = () => {
        if(userInfo.id && id){
            movieApi.addToFavorite(userInfo.id, session.userSession, id)
            setPopupSuccess(true)
            setTimeout(() => setPopupSuccess(false), 1500)
        } else {
            setPopupError(true)
            setTimeout(() => setPopupError(false), 1500)
        }

    }

    const setVoteClass = (vote: number | undefined) => {
        if(vote){
            if (vote >= 7) return "tag-green"
            if (vote >= 4) return "tag-orange"
            if (vote < 4) return "tag-red"
        }
    }

    return (
        <>
        {Object.keys(movieDetails).length ? 
            <div>
                <div className={`fixed top-[10px] left-[50%] translate-x-[-50%] w-[130px] bg-green-500 flex justify-center rounded-full z-[999]
                ${popupSuccess ? "block" : "hidden"}`}>Succesfully added</div>
                <div className={`fixed top-[10px] left-[50%] translate-x-[-50%] w-[160px] bg-red-500 text-white flex justify-center rounded-full z-[999] opacity-100 transition-opacity
                ${popupError ? "block" : "hidden"}`}>You need to login first</div>
                <img src={basicImageUrl + movieDetails?.backdrop_path} alt="backdrop-image" className="w-full h-[800px] object-cover object-top mobile:h-[1300px] tablet:h-[1300px]" /> 
                <div className={`absolute ${movieDetails?.backdrop_path ? "bg-gradient-to-r from-black" : "bg-[#a7a2a2]"} w-full h-[800px] top-0 mobile:h-[1300px] tablet:h-[1300px]`}>
                    <div className="w-[95%] m-auto md:w-[90%] lg:w-[90%] xl:w-[70%] 2xl:w-[70%] flex pt-[40px] gap-[50px] tablet:gap-[20px] mobile:flex-col mobile:pt-[10px]">
                        {movieDetails?.poster_path ? 
                        <div className="w-[400px] h-[500px] mobile:w-[200px] mobile:h-[300px] tablet:w-[200px] tablet:h-[300px]">
                            <img src={basicImageUrl + movieDetails?.poster_path} alt="poster" className="w-[400px] h-[500px] object-cover mobile:w-[200px] mobile:h-[300px] 
                            tablet:w-[200px] tablet:h-[300px] smallpc:w-[500px]"/>
                        </div> : 
                        <div className="w-[400px] h-[500px] bg-[#c7c2c2d6] flex items-center justify-center rounded-lg">
                                    <img src={blank} alt="blank-icon" className="w-[100px] h-[100px] "/>
                            </div>}
                        <div className="w-[70%] mobile:w-[100%]">
                            <div className="hidden text-white smallpc:block mdpc:block otherpc:block">
                                <span className="font-bold text-[2.2rem]">{movieDetails?.title}</span>
                                <span className="opacity-80 text-[2.2rem]"> ({moment(movieDetails?.release_date).format('YYYY')})</span> <br />
                                <div className="px-[4px] border opacity-60 inline w-[50px] tablet:text-[11px] smallpc:text-[12px]">{movieDetails?.adult ? "PG-18" : "PG-13"}</div>
                                <span className="ml-[10px]">{moment(movieDetails?.release_date).format('L')}</span>
                                <span className="ml-[10px]">({movieDetails?.production_countries[0]?.iso_3166_1})</span>
                                    <span className="ml-[10px]">&bull;</span>
                                    {movieDetails?.genres.map( (genre: {name: string, id: number}) => (
                                        <span key={genre.id} className="ml-[10px]">{genre.name}</span>
                                    ))}
                                    <span className="mx-[10px]">&bull;</span>
                                <span>{calcTime(movieDetails?.runtime)}</span>
                                <div className="mt-[25px] flex items-center">
                                    <div className={`select-none font-bold bg-[#153e4a] w-[60px] h-[60px] rounded-full flex items-center justify-center text-[1.2em] px-[20px] 
                                    py-[20px] ${setVoteClass(movieDetails?.vote_average)}`}>{movieDetails?.vote_average ? movieDetails?.vote_average * 10 : ""} 
                                        <span className="text-[11px]">%</span>
                                    </div>
                                    <span className="font-bold ml-[11px]">User <br /> Score</span>
                                    <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-[#153e4a] cursor-pointer ml-[11px]" 
                                    onClick={addToFavorite}>
                                        <img src={heart} alt="heart-icon" className="w-[32px] h-[32px]" />
                                    </div>
                                </div>
                                <div className="mt-[25px]">
                                    <span className="font-bold text-[1.5em]">Overview</span>
                                    <p>{movieDetails?.overview}</p>
                                </div>
                                <div className="grid grid-cols-3 grid-rows-3 mt-[30px] gap-y-[20px] tablet:grid-cols-2 smallpc:grid-cols-2">
                                    {id && <CrewCreditDetails id={id} movieDetails={movieDetails}/>}
                                </div>
                            </div>
                            <div className="hidden text-white mobile:block tablet:block">
                                <span className="font-bold text-[2.2rem] mobile:text-[1.8rem]">{movieDetails?.title}</span>
                                <span className="opacity-80 text-[2.2rem] mobile:text-[1.8rem]"> ({moment(movieDetails?.release_date).format('YYYY')})</span> <br />
                                <div className="px-[4px] border opacity-60 inline w-[50px]">{movieDetails?.adult ? "PG-18" : "PG-13"}</div> <br />
                                <span>{moment(movieDetails?.release_date).format('L')}</span>
                                <span className="ml-[10px]">({movieDetails?.production_countries[0]?.iso_3166_1})</span>
                                <div className="flex flex-wrap">
                                    <span className="ml-[10px]">&bull;</span>
                                    {movieDetails?.genres.map( (genre: {name: string, id: number}) => (
                                        <span key={genre.id} className="ml-[10px]">{genre.name}</span>
                                    ))}
                                    <span className="mx-[10px]">&bull;</span>
                                </div>       
                                <span>{calcTime(movieDetails?.runtime)}</span>
                                <div className="mt-[25px] flex items-center">
                                    <div className={`select-none font-bold bg-[#153e4a] w-[60px] h-[60px] rounded-full flex items-center justify-center text-[1.2em] px-[20px] 
                                    py-[20px] ${setVoteClass(movieDetails?.vote_average)}`}>{movieDetails?.vote_average ? movieDetails?.vote_average * 10 : ""} 
                                        <span className="text-[11px]">%</span>
                                    </div>
                                    <span className="font-bold ml-[11px]">User <br /> Score</span>
                                    <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-[#153e4a] cursor-pointer ml-[11px]" onClick={addToFavorite}>
                                        <img src={heart} alt="" className="w-[32px] h-[32px]" />
                                    </div>
                                </div>
                                <div className="mt-[25px]">
                                    <span className="font-bold text-[1.5em]">Overview</span>
                                    <p>{movieDetails?.overview}</p>
                                </div>
                                <div className="grid grid-cols-2 grid-rows-3 mt-[30px] gap-y-[20px]">
                                    {id && <CrewCreditDetails id={id} movieDetails={movieDetails}/>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div> : 
            <div className="flex items-center justify-center h-[100%] w-[100%]">
                <img src={loader} alt="spinner" className="w-[64px] h-[64px]" />
            </div>}
            
        </>
    )
}

export default MovieInfo;
