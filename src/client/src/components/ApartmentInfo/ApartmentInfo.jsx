import React,{useState,useEffect} from 'react'
import ListingBanner from '../ListingBanner/ListingBanner'
import {useDispatch,useSelector} from "react-redux"
import {useParams, useLocation,useHistory} from "react-router-dom"
import {Start_Basic_Query} from "../../redux/EntityRedux/action.js"
import HostProfileInfo from '../HostProfileInfo/HostProfileInfo'
import MainEntityInfo from '../MainEntityInfo/MainEntityInfo'

export default function ApartmentInfo() {
    let dispatch = useDispatch()
    let params = useParams()
    let location = useLocation()
    let history = useHistory()
    console.log(params,location,history)

    useEffect(()=>{
        dispatch(Start_Basic_Query(params["id"]))
    },[])
    return (
        <div>
            <ListingBanner />
            <HostProfileInfo />
            <div style={{height:"385px"}}></div>
            <MainEntityInfo />
        </div>
    )
}
