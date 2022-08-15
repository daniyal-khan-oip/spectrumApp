import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  FlatList,
  ScrollView,
  Platform,
} from 'react-native';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import Heading from '../components/Heading';
import Button from '../components/Button';
import {
  themeBlue,
  themeDarkBlue,
  themeFerozi,
  themeLightBlue,
  themePurple,
} from '../assets/colors/colors';
import { Svg, Polygon, Rect, Styles, G, Path } from 'react-native-svg';
import * as actions from '../store/actions';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { Shadow } from 'react-native-shadow-2';
import OctIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const GradingSystem = ({
  navigation,
  route,
  getColors,
  userReducer,
  getAssessmentDetails,
  getGameInfo,
  submitResult,
}) => {
  const accessToken = userReducer?.accessToken;
  const ITEM = route?.params?.item;
  const Event = route.params.event;
  const GROUP_DATA = route.params.groupData;
  const CHILD_DATA = route.params.childData;
  const [Memebers, setMembers] = useState([]);
  console.log('hkhklahksdhakhdskl;ahkld', Memebers);
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [score, setScore] = useState('');
  const [ranges, setRanges] = useState([]);
  const [Resultvalue, setResultvalue] = useState({});
  const [assessment_id, setassessment_id] = useState([]);
  const [Uservalue, setUservalue] = useState({});
  console.log('=======>', Uservalue);
  // const [resultColor, setResultColor] = useState(
  //   colors[0]?.WebColor || 'black',
  // );
  // console.log("result vaue", Resultvalue)
  // console.log("sjdk", CHILD_DATA.grade_id)
  // console.log("Grading screen", Event)
  //  useEffect(() => {
  //     setRes(ranges[0]?.MaxValue);
  //   }, []);
  useLayoutEffect(() => {
    setMembers(route.params?.memberData)
  }, [])
  // console.log("firsttttttttttttttttttttttttt",userReducer?.assessmentDetails?.assessment_scoring[0]?.assessment_id)
  // useEffect=(()=>{
  //   setassessment_id(userReducer?.assessmentDetails.assessment_scoring[0]?.assessment_id)
  // },[assessment_id])


  // const Resulting =
  //   userReducer?.assessmentDetails?.assessment_scoring[0].MaxValue;
  // console.log('Areaaa', userReducer?.assessmentDetails?.assessment_scoring);
  // useEffect(() => {
  //   findResult();
  // }, [score]);

  useEffect(() => {
    setUservalue(route.params.childData)
    getAllColors();
  }, []);

  const getAllColors = async () => {
    setIsLoading(true);
    await getGameInfo(accessToken);
    await getColors(accessToken);
    await getAssessmentDetails(ITEM?.id, accessToken);
    setIsLoading(false);
  };

  useEffect(() => {
    setColors(userReducer?.colors);
  }, [userReducer?.colors]);

  useEffect(() => {
    setRanges(userReducer?.assessmentDetails?.assessment_scoring);
  }, [userReducer?.assessmentDetails]);

  const _onPressSave = async () => {
    let color_id = userReducer?.gameInfo[0]?.color_id;
    for (let i = 0; i <= userReducer?.gameInfo?.length; i++) {
      if (
        userReducer?.gameInfo[i]?.MinValue <= score &&
        userReducer?.gameInfo[i]?.MaxValue >= score
      ) {
        color_id = userReducer?.gameInfo[i]?.color_id;
      }
    }
    const apiData = {
      assessment_score_id: Resultvalue.id || 0,
      participant_id: Uservalue?.id,
      Score: Resultvalue.MaxValue || "0",
      grade_id: CHILD_DATA?.grade_id,
      assessment_id: userReducer?.assessmentDetails?.id,
      Beep: null,
      group_id: GROUP_DATA?.id,
      event_id: Event.id
    };
    setIsLoading(true);
    // console.log(JSON.stringify(apiData, null, 2));
    // console.log("+++++++++++++++++=", userReducer?.assessmentDetails?.id);
    await submitResult(apiData, accessToken, onSuccess);
    setIsLoading(false);
  };

  const onSuccess = () => {
    if ((Uservalue.index + 1) < Memebers.length) {
      const updatedMembers = [...Memebers].map((it) => {
        if (it.id == Uservalue.id) {
          return {
            ...it,
            disable: true
          }
        } else {
          return it
        }
      })
      setMembers(updatedMembers)
      const newIndex = Memebers[Uservalue.index + 1].disable ? (Uservalue.index + 2) : Uservalue.index + 1
      setUservalue({ ...Memebers[newIndex], index: newIndex })
    } else {
      navigation.navigate('home');
    }
  };
  // var RangeValue = parseInt(ranges[0]?.MaxValue);

  // console.log("first",ranges[0].MaxValue)

  // const findResult = () => {
  //   if (score > parseInt(ranges[0]?.MaxValue)) {
  //     setResultColor(colors[0]?.WebColor);
  //   } else if (score > parseInt(ranges[1]?.MaxValue)) {
  //     setResultColor(colors[7]?.WebColor);
  //   } else if (score > parseInt(ranges[2]?.MaxValue)) {
  //     setResultColor(colors[6]?.WebColor);
  //   } else if (score > parseInt(ranges[3]?.MaxValue)) {
  //     setResultColor(colors[5]?.WebColor);
  //   } else if (score > parseInt(ranges[4]?.MaxValue)) {
  //     setResultColor(colors[4]?.WebColor);
  //   } else if (score > parseInt(ranges[5]?.MaxValue)) {
  //     setResultColor(colors[3]?.WebColor);
  //   } else if (score > parseInt(ranges[6]?.MaxValue)) {
  //     setResultColor(colors[2]?.WebColor);
  //   } else if (score > parseInt(ranges[7]?.MaxValue)) {
  //     setResultColor(colors[1]?.WebColor);
  //   } else {
  //     setResultColor(colors[0]?.WebColor);
  //   }
  // };

  const RenderMembersData = ({ item, index }) => (
    <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
      {/* {console.log(Memebers)} */}
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        disabled={item.disable}
        onPress={() => {
          setUservalue({ ...item, index });
        }}>
        <Text
          style={{
            fontSize: 20,
            alignSelf: 'center',
            color: item.disable ? 'gray' : (Uservalue.id == item.id ? 'green' : 'white'),
            // textAlign: 'center',
            // textAlignVertical: 'center',
            letterSpacing: 1
          }}>
          {`${item.Firstname} ${item.Lastname}`}
        </Text>

        {
          Uservalue.id == item.id ?
            <Text
              style={{
                fontSize: 20,
                alignSelf: 'center',
                color: item.disable ? 'gray' : (Uservalue.id == item.id ? 'green' : 'white'),
                letterSpacing: 1,
                marginLeft: width * 0.05

              }}>
              ✓
            </Text> :
            <Text></Text>
        }

      </TouchableOpacity>
    </View>
  );

  const RenderimageDAta = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setResultvalue(item);
      }}
    >
      <Image
        style={{ height: height * .095, width: width * .155, marginTop: height * .02, opacity: Resultvalue.image == item.image ? 1 : .5 ,resizeMode:"contain"}}
        source={{
          uri:
            item.image === null
              ? 'https://webprojectmockup.com/custom/spectrum-8/public/images/assessment_image/scoring/error.png'
              : `https://webprojectmockup.com/custom/spectrum-8/public/images/assessment_image/scoring/${item.image}`,
        }}
      />
      {/* <Text style={{position:"absolute",color:"white",fontWeight:"500",marginLeft:22,marginTop:25}}>
       {item.image == null?"":item.MaxValue}
     </Text> */}
    </TouchableOpacity>
  );
  console.log("=============================", Resultvalue, !Resultvalue.id ? 1 : .5);
  return (
    <>
      <StatusBar backgroundColor={themeDarkBlue} />
      <ImageBackground
        source={require('../assets/images/bg.jpg')}
        style={styles.container}>
        <View>
          <Heading
            title={ITEM?.Name}
            passedStyle={styles.headingStyles}
            fontType="semi-bold"
          />
        </View>

        {/* <Image
              resizeMode="contain"
              source={require('../assets/images/logo.png')}
              style={styles.bgimage}
            /> */}

        {/* Grade  */}
        <View
          style={{
            height: height * 0.20,
            width: width * 0.9,
            backgroundColor: themeDarkBlue,
            borderRadius: 10,
            paddingLeft: 20,
            alignSelf: "center"
          }}>
          <FlatList

            data={Memebers}
            renderItem={RenderMembersData}
            keyExtractor={item => item.id}
          // scrollEnabled={false}
          // contentContainerStyle={{
          //   flexGrow: 1,
          // }}
          />
        </View>
        {isLoading ? (
          <LottieView
            speed={1}
            style={styles.lottieStyle}
            autoPlay
            loop
            source={require('../assets/lottie/color-loader.json')}
          />
        ) : (
          <View showsVerticalScrollIndicator={false}>
            <ScrollView>
              <View style={[styles.headingStyle2View, { marginBottom: 20 }]}>
                <Heading
                  title={`${GROUP_DATA?.Name} - ${GROUP_DATA?.Abbr}`}
                  passedStyle={styles.headingStyles2}
                  fontType="regular"
                />
              </View>
              {/* Child Name  */}
              {/* <View style={styles.headingStyle2View}>
              <Heading
                title={`${CHILD_DATA?.Firstname} ${CHILD_DATA?.Lastname}`}
                passedStyle={styles.headingStyles2}
                fontType="regular"
              />
            </View> */}

              <View style={{ alignItems: "center", justifyContent: "space-evenly" }}>
                <FlatList
                style={{ marginLeft: width*0.08, marginTop: Platform.OS == "ios" ? 30 : 0 }}
                  data={ranges}
                  renderItem={RenderimageDAta}
                  keyExtractor={item => item.id}
                  numColumns={4}
                />
              </View>
              {/* <Text>haz,a</Text> */}
              <TouchableOpacity
                onPress={() => { setResultvalue({}) }}
                style={{
                 
                  height: height * 0.075,
                  backgroundColor: !Resultvalue.id ? "black" : "rgba(0, 0, 0, 0.36)",
                  width: width * 0.3,
                  borderRadius: width * 0.5,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: height * .03,
                  marginBottom: -height * 0.02,
                  marginLeft: width * 0.05
                }}
              >
                {/* <Image
                  source={require('../assets/images/black.png')}
                  style={{
                    height:height*.1, 
                    width:width*.185,
                    marginLeft: width * 0.05,
                    opacity: Resultvalue.length == 0 ? 1 : .5
                  }}
                /> */}
                <Text style={{
                  color: "white",
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontSize: width * 0.04,
                  fontWeight: "600",

                }}>
                  N/A
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom: height * 0.1,
                }}>
                {/* <TextInput
                value={score}
                keyboardType="numeric"
                placeholder={`Enter Score 0-${Resulting} `}
                placeholderTextColor={'grey'}
                style={styles.scoreFieldStyle}
                onChangeText={text => {
                  if (parseInt(text) > parseInt(Resulting)) {
                    showMessage({
                      type: 'danger',
                      message: 'Score is exceeding the scale values.',
                    });
                    return;
                  }
                  setScore(text);
                }}
              /> */}

                {
                  <TouchableOpacity
                    onPress={_onPressSave}
                    style={styles.saveBtnStyle}>
                    <Heading
                      title={'SAVE'}
                      passedStyle={styles.startBtnStyle}
                      fontType="bold"
                    />
                  </TouchableOpacity>
                }
                <View style={{ paddingBottom: 150 }} />
              </View>
            </ScrollView>
          </View>
        )}
      </ImageBackground>
    </>
  );
};

const mapStateToProps = ({ userReducer }) => {
  return {
    userReducer,
  };
};

export default connect(mapStateToProps, actions)(GradingSystem);
const styles = StyleSheet.create({
  startBtnStyle: {
    color: 'white',
    fontSize: width * 0.04,
    paddingVertical: height * 0.02,
    textAlign: 'center',
  },
  saveBtnStyle: {
    marginLeft: width * 0.05,
    backgroundColor: themeFerozi,
    borderRadius: width * 0.5,
    marginTop: width * -0.03,
    width: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  scoreFieldStyle: {
    backgroundColor: 'white',
    width: width * 0.5,
    height: height * 0.06,
    paddingHorizontal: width * 0.03,
    marginLeft: width * 0.05,
    // paddingBottom: height * 0.007,
    marginVertical: height * 0.02,
    fontFamily: 'Montserrat-Medium',
    borderRadius: width * 0.1,
    fontSize: width * 0.047,
    // textAlign:"center"
  },
  btnStyle: {
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeLightBlue,
    alignSelf: 'center',
    width: width * 0.41,
  },
  headingStyles: {
    maxWidth: width * 0.9,
    color: 'white',
    backgroundColor: themeFerozi,
    fontSize: width * 0.045,
    borderRadius: width * .1,
    paddingVertical: height * 0.01,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.05,
  },

  headingStyles2: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: width * 0.045,
    paddingVertical: height * 0.02,
  },
  headingStyle2View: {
    width: width * 0.9,
    borderRadius: 25,
    marginTop: height * 0.02,
    backgroundColor: themeDarkBlue,
    alignSelf: 'center',
  },
  btnTextStyle: {
    color: 'white',
    fontSize: width * 0.04,
    fontFamily: 'Montserrat-SemiBold',
  },
  jumpbtn: {
    width: width * 0.5,
    height: height * 0.05,
    backgroundColor: '#16c4bc',
    alignSelf: 'center',
    margin: 20,
    borderRadius: 100,
    justifyContent: 'center',
  },
  jumpText: {
    textAlign: 'center',
    fontSize: width * 0.042,
    fontWeight: '900',
    color: 'white',
  },
  bgimage: {
    marginBottom: height * 0.02,
    width: width * 0.4,
    height: height * 0.2,
    alignSelf: 'center',
  },
  Button: {
    width: width * 0.85,
    height: height * 0.06,
    backgroundColor: '#000b2d',
    alignSelf: 'center',
    marginTop: 5,
    borderRadius: 100,
    justifyContent: 'center',
  },
  Text: {
    textAlign: 'center',
    fontSize: width * 0.042,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 3,
  },
  gradeimage: {
    marginBottom: height * 0.02,
    // width: width * 0.07,
    // height: height * 0.07,
    // alignSelf: 'center',
    paddingHorizontal: 5,
    // borderWidth: 1,
    // borderColor: 'white',
  },
  taskimage: {
    height: height * 0.12,
    width: width * 0.2,
    marginLeft: width * 0.09,
    marginTop: 20,
  },
  savebtn: {
    width: width * 0.3,
    height: height * 0.05,
    backgroundColor: '#16c4bc',
    alignSelf: 'flex-start',
    marginLeft: 20,
    borderRadius: 100,
    justifyContent: 'center',
    elevation: 5,
    marginBottom: 50,
  },
  saveText: {
    textAlign: 'center',
    fontSize: width * 0.038,
    fontWeight: '400',
    color: 'white',
    // paddingBottom:50,
  },
  gradeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
  },
  lottieStyle: {
    height: Platform?.OS === 'ios' ? height * 0.33 : height * 0.38,
    marginTop: height * 0.038,
    marginLeft: Platform?.OS === 'ios' ? width * 0.05 : width * 0.07,
  },
});
