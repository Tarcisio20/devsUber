import React, { useRef, useState, useEffect } from 'react'
import { StatusBar, SafeAreaView, Text } from 'react-native'
import Geolocation from '@react-native-community/geolocation'
import Geocoder from 'react-native-geocoding' 
import MapViewDirections from 'react-native-maps-directions'
import MapView from 'react-native-maps'

import {MapsAPI } from './../../config'
import useDevsUberApi from './../../useDevsUberApi'

import {
    Container,
    IntineraryArea,
    IntineraryItem,
    IntineraryLabel,
    IntineraryPoint,
    IntineraryTitle,
    IntineraryValue,
    IntineraryPlaceHolder,
    RequestDetails,
    RequestDetail,
    RequestTitle,
    RequestValue,
    RequestButtons,
    RequestButton,
    RequestButtonText
} from './styled'

const Page = () => {

    const map = useRef();
    const api = useDevsUberApi()

    const [mapLoc, setMapLoc] = useState({
        center:{
            latitude:37.78825,
            longitude:-122.4324
        },
        zoom:16,
        pitch:0,
        altitude:0,
        heading:0
    });

    const [fromLoc, setFromLoc]= useState({})
    const [toLoc, setToLoc]= useState({})
    const [showDirections, setShowDirections] = useState(false)
    const [requestDistance, setRequestDistance] = useState(0)
    const [requestTime, setRequestTime] = useState(0)
    const [requestPrice, setRequestPrice] = useState(0)

    useEffect(()=>{
        Geocoder.init( MapsAPI , {language:'pt-br'})
        getMyCurrentPosition()
    },[])

    useEffect(()=>{
        if(fromLoc.center && toLoc.center){
            setShowDirections(true)
        }
    },[])

    const getMyCurrentPosition = () =>{
            Geolocation.getCurrentPosition(async info=>{
            const geo = await Geocoder.from(info.coords.latitude, info.coords.longitude)

            if(geo.results.length > 0){
                const loc = {
                    name:geo.results[0].formatted_address,
                    center:{
                        latitude:info.coords.latitude,
                        longitude:info.coords.longitude
                    },
                    zoom:16,
                    pitch:0,
                    altitude:0,
                    heading:0
                }
                setMapLoc(loc)
                setFromLoc(loc)
            }
        }, error=>{

        })
    }

    const handleFromClick = () => {

    }
    const handleToClick = async () => {
        const geo = await Geocoder.from('Unidade 201, Rua 19, Casa 19 Cidade Operaria')
        if(geo.results.length > 0){
            const loc = {
                name:geo.results[0].formatted_address,
                center:{
                    latitude:geo.results[0].geometry.location.lat,
                    longitude:geo.results[0].geometry.location.lng
                },
                zoom:16,
                pitch:0,
                altitude:0,
                heading:0
            }

            setToLoc(loc)
        }
    }

    const handleDirectionsReady = async (r) => {
        setRequestDistance(r.distance)
        setRequestTime(r.duration)


        const priceReq = await api.getRequestPrice(r.distance)
        if(!priceReq.error ){
            setRequestPrice(priceReq.price)
        }
        map.current.fitToCoordinates(r.coordinates, {
            edgePadding:{
                left:50,
                right:50,
                bottom:50,
                top:800
            }
        })
    }

    const handleRequestGo = () => {

    }

    const handleRequestCancel = () => {
        
    }

    return(
        <Container>
            <StatusBar barStyle="dark-content" />
            <MapView
                ref={map}
                style={{flex:1}}
                provider="google"
                camera={mapLoc}
            >

            {fromLoc.center &&
                <MapView.Marker pinColor="black" coordinate={fromLoc.center} />
            }

            {toLoc.center &&
                <MapView.Marker pinColor="black" coordinate={toLoc.center} />
            }

            {showDirections && 
                <MapViewDirections 
                    origin={fromLoc.center}
                    destination={toLoc.center}
                    strokeWidth={5}
                    strokeColor="black"
                    apikey={MapsAPI}
                    onReady={handleDirectionsReady}
                />
            }

            </MapView>
            <IntineraryArea>
                <IntineraryItem onPress={handleFromClick} underlayColor="#EEE">
                    <>
                        <IntineraryLabel>
                            <IntineraryPoint color="#0000FF" />
                            <IntineraryTitle>Origem</IntineraryTitle>
                        </IntineraryLabel>
                        {fromLoc.name &&
                            <IntineraryValue>
                                {fromLoc.name}
                            </IntineraryValue>
                        }
                        {!fromLoc.name &&
                            <IntineraryPlaceHolder>
                                Escolha um local de origem
                            </IntineraryPlaceHolder>
                        }
                    </>
                </IntineraryItem>

                <IntineraryItem onPress={handleToClick} underlayColor="#EEE">
                    <>
                        <IntineraryLabel>
                            <IntineraryPoint color="#00FF00" />
                            <IntineraryTitle>Destino</IntineraryTitle>
                        </IntineraryLabel>
                        {toLoc.name &&
                            <IntineraryValue>
                                {toLoc.name}
                            </IntineraryValue>
                        }
                        {!toLoc.name &&
                            <IntineraryPlaceHolder>
                                Escolha um local de destino
                            </IntineraryPlaceHolder>
                        }
                    </>
                </IntineraryItem>
                {fromLoc.center && toLoc.center &&
                    <IntineraryItem>
                        <>
                            <RequestDetails>
                                <RequestDetail>
                                    <RequestTitle>Distância</RequestTitle>
                        <RequestValue>{requestDistance > 0?`${requestDistance.toFixed(1)}km`:'---'}</RequestValue>
                                </RequestDetail>

                                <RequestDetail>
                                    <RequestTitle>Tempo</RequestTitle>
                                    <RequestValue>{requestTime > 0?`${requestTime.toFixed(0)}min`:'---'}</RequestValue>
                                </RequestDetail>

                                <RequestDetail>
                                    <RequestTitle>Preço</RequestTitle>
                                    <RequestValue>{requestPrice > 0?`R$ ${requestPrice.toFixed(2)}`:'---'}</RequestValue>
                                </RequestDetail>
                            </RequestDetails>
                            <RequestButtons>
                                <RequestButton color="#00FF00" onPress={handleRequestGo}>
                                    <RequestButtonText>
                                        Solicitar Motorista
                                    </RequestButtonText>
                                </RequestButton>
                                <RequestButton color="#FF0000" onPress={handleRequestCancel}>
                                    <RequestButtonText>
                                        Cancelar
                                    </RequestButtonText>
                                </RequestButton>
                            </RequestButtons>
                        </>
                    </IntineraryItem>
                }
            </IntineraryArea>

        </Container>
    )
}

export default Page