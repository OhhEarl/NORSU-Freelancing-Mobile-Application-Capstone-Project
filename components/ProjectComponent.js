import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native'
import * as theme from '../assets/constants/theme'
import Icon from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import locale from 'dayjs/locale/en'

const ProjectComponent = ({ item }) => {

    dayjs.extend(relativeTime).locale('en');
    const formattedStartDate = dayjs(item?.job_start_date).format('MMMM D, YYYY');
    const formattedEndDate = dayjs(item?.job_end_date).format('MMMM D, YYYY')


    const startDate = dayjs(item?.job_start_date);
    const endDate = dayjs(item?.job_end_date);

    const durationInDays = endDate.diff(startDate, 'day');

    const jobDescription = item?.job_description || ''; // Ensure job_description exists


    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.jobTitle}>{item?.job_title}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.jobTime}>Posted {dayjs(item?.created_at).fromNow()}</Text>
                    <Text style={styles.jobTime}> • </Text>
                    <Text style={styles.jobTime}>{formattedStartDate}</Text>
                    <Text style={styles.jobTime}> - </Text>
                    <Text style={styles.jobTime}>{formattedEndDate}</Text>
                </View>

            </View>

            <View style={styles.textContainer}>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.jobTime}>Budget:</Text>
                    <Text style={styles.jobTime}> • </Text>


                    <Text style={styles.jobTime}>₱{new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(item?.job_budget_from)}</Text>
                </View>

            </View>


            <Text style={styles.jobDescription}>
                {jobDescription.trimStart().length > 100 ? jobDescription.trimStart().slice(0, 125) + '...' : jobDescription.trimStart()}
            </Text>
            <View style={styles.jobTagsContainer}>

                {item?.job_tags.length > 0 &&
                    item?.job_tags.map((tag, index) => (
                        <Text key={index} style={styles.jobTag}>
                            {tag.job_tags}
                        </Text>
                    ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 17,
        padding: 15,
        borderRadius: 10,
        backgroundColor: theme.colors.WHITE,
        borderColor: theme.colors.grey,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    textContainer: {
        flex: 1,
        paddingHorizontal: 5
    },
    jobTitle: {
        fontSize: theme.sizes.h3 + 2,
        color: theme.colors.primary,
        fontFamily: 'Roboto-Medium'
    },
    jobTime: {
        color: theme.colors.gray,
        fontFamily: 'Roboto-Medium',
        fontSize: theme.sizes.h2 - 2,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    priceContainer: {
        paddingVertical: 6,
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: theme.colors.grey,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 6,
        width: 100
    },
    jobPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    jobPrice: {
        fontFamily: 'Roboto-Medium',
        fontSize: theme.sizes.h2 + 1,
        color: theme.colors.BLACKS,
    },
    jobRangePrice: {
        fontFamily: 'Roboto-Medium',
        fontSize: theme.sizes.h1 + 2,
        color: theme.colors.gray,
        marginTop: 1,
    },
    jobDescription: {
        paddingHorizontal: 12,
        fontFamily: 'Roboto-Light',
        color: theme.colors.gray,
        marginTop: 5
    },
    jobTagsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        marginTop: 10
    },
    jobTag: {
        marginEnd: 10,
        borderRadius: 10,
        backgroundColor: theme.colors.primary,
        paddingVertical: 2,
        paddingHorizontal: 10,
        fontSize: theme.sizes.h2 - 1,
        color: theme.colors.WHITE,
        fontFamily: 'Roboto-Light'
    }
})

export default ProjectComponent