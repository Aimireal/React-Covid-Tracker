import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Loading from './Loading'

const Regions = () => {
    const [data, setData] = useState([])
    const [dataError, setDataError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")

    const fetchData = async() => {
        try {
            const {
                data: { data },
            } = await axios.get(
                `https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=utla&latestBy=newCasesByPublishDate&structure={"date":"date","newCases":"newCasesByPublishDate","newDeaths":"newDeaths28DaysByPublishDate","region":"areaName","regionId":"areaCode"}`
            )

            setLoading(false);
            setData(data);
        } catch (error) {
            setLoading(false)
            setDataError("Error: Fetching data failed")
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return loading ? (
        <Loading type='regional' />
    ) : dataError ? (
        <p className='text-md font-light italic'>{dataError}</p>
    ) : (
        <div>
            <div className='mb-5'>
                <span className='z-10 leading-snug font-normal text-center text-gray-400 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3'>
                    <i className='fas fa-search'></i>
                </span>
    
                <div className='flex'>
                    <input
                        type='text'
                        placeholder='Search regions'
                        value={search || ""}
                        onChange={(e) => setSearch(e.target.value)}
                        className='px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pl-10'
                    />
                    <button
                        className='bg-charcoal hover:bg-gray-800 ease-in-out duration-200 ml-1 w-10 rounded'
                        onClick={(e) => setSearch("")}
                    >
                        <i className='fas fa-undo text-gray-50'></i>
                    </button>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-x-12 md:gap-y-4 mb-5'>
                { loading? null: data
                .filter((region) =>
                    region.region.toLowerCase().includes(search.toLowerCase())
                )
                .map((region) => (
                    <Link to={`region/${region.regionId}`} key={region.regionId}>
                    <div className={`w-full  p-5 mb-5 md:mb-0 text-left font-semibold  rounded-md bg-pacific hover:bg-pacificHover ease-in-out duration-100 text-gray-50`}>
                        <div className='flex flex-col'>
                        <p className='text-md font-normal'>{region.region}</p>
                        <p className='text-xl'>{`${
                            region.newCases == null ? "0" : region.newCases
                        } new cases`}</p>
                        <p className='text-xl'>{`${
                            region.newDeaths == null ? "0" : region.newDeaths
                        } new deaths`}</p>
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    )   
}
        

export default Regions
