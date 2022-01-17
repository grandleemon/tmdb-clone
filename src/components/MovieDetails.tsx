import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMovieDetails } from '../api/api'
import MovieInfo from './MovieInfo'
import CastCreditDetails from './CastCreditDetails'
import MovieReviews from './MovieReviews'
import MovieRecomendations from './MovieRecomendations'
import MovieSocials from './MovieSocials'
import MovieKeywords from './MovieKeywords'
import './MovieDetails.css'
import useDocumentTitle from './useTitle'

export interface MovieDetailsTypes {
    backdrop_path: string | null,
    title: string, 
    poster_path: string, 
    release_date: string, 
    adult: boolean,
    production_countries: [
        {iso_3166_1: string}
    ]
    genres: [],
    runtime: number, 
    vote_average?: number, 
    overview: string,
    homepage: string,
    status: string,
    original_language: string,
    budget: number,
    revenue: number
}

function numberWithCommas(x:number | undefined) {
    if(x)
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const MovieDetails = (props: any) => {
    const {id, title}: any = useParams()
    const [movieDetails, setMovieDetails]= useState<MovieDetailsTypes>()

    useEffect( () => {
        
        getMovieDetails(id, setMovieDetails);
    }, [id])  
    
    useDocumentTitle(movieDetails?.title)

    return (
        <div>
            <div className="w-[95%] m-auto md:w-[80%] lg:w-[70%]">
                <ul className="flex justify-center gap-x-[50px] items-center h-[46px]">
                    <li><span>Overview</span></li>
                    <li><span>Media</span></li>
                    <li><span>Fandom</span></li>
                    <li><span>Share</span></li>
                </ul>
            </div>
            <div className="w-full h-[800px] relative">
                <MovieInfo movieDetails={movieDetails} setMovieDetails={setMovieDetails} session={props.session} userInfo={props.userInfo}/>
            </div>
            <div className="w-[95%] m-auto md:w-[80%] lg:w-[70%] pt-[30px] grid grid-cols-4">
                <div className="col-span-3">
                    <CastCreditDetails id={id} movieDetails={movieDetails} />
                    <p className="font-bold text-[1.5em] mt-[20px]">Full Cast & Crew</p>
                    <hr className="border mt-[30px] mb-[30px]" />
                    <div>
                        <div>
                            <ul className="flex gap-x-[30px] font-bold items-center">
                                <li className="text-[1.3em] cursor-pointer">Social</li>
                                <li className="text-[1.1em] cursor-pointer">Reviews</li>
                                <li className="text-[1.1em] cursor-pointer">Discussions</li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-y-[30px] mt-[20px]">
                            <MovieReviews id={id} movieDetails={movieDetails}/>
                        </div>
                        <hr className="border mt-[30px]" />
                        <div className="mt-[30px]">
                            <h2 className="font-semibold text-[1.5em]">Recomendations</h2>
                            <div className="flex overflow-x-scroll gap-x-[30px]">
                                <MovieRecomendations id={id} movieDetails={movieDetails}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pl-[25px]">
                    <div className="flex gap-x-[20px]">     
                        <MovieSocials id={id} movieDetails={movieDetails}/>
                    </div>
                    <div className="mt-[20px]">
                        <p className="font-bold text-[1.2em]">Status</p>
                        <p>{movieDetails?.status}</p>
                        <p className="font-bold text-[1.2em] mt-[15px]">Original Language</p>
                        <p className="uppercase">{movieDetails?.original_language}</p>
                        <p className="font-bold text-[1.2em] mt-[15px]">Budget</p>
                        {movieDetails?.budget ? <p>${numberWithCommas(movieDetails?.budget)}</p> : "-"}
                        <p className="font-bold text-[1.2em] mt-[15px]">Revenue</p>
                        {movieDetails?.revenue ? <p>${numberWithCommas(movieDetails?.revenue)}</p> : "-"}
                    </div>
                    <div className="mt-[20px]">
                        <p className="font-bold text-[1.2em]">Keywords</p>
                        <div className="flex flex-wrap gap-[8px] mt-[10px]">
                           <MovieKeywords id={id} movieDetails={movieDetails}/>
                        </div>
                    </div>
                    <hr className="border mt-[30px] mb-[30px]" />
                </div>
            </div>
            
        </div>
    )
}

export default MovieDetails
