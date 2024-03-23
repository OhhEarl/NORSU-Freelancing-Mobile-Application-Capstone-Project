import COLORS from "./colors"

const UTILITIES = {
    inputField: {
        height: 50,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: "#fff",
        paddingLeft: 16,
        fontFamily: 'Raleway-Medium',
        color: COLORS.PLACEHOLDER_COLOR,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.18,
        shadowRadius: 4.59,
        elevation: 5
    },
    title: {
        marginBottom: 5,
        marginStart: 4,
        fontFamily: 'Roboto-Bold',
        color: COLORS.primary,
        fontSize: 16
    },

    header: {
        fontSize: 24,
        color: COLORS.secondary,
        fontFamily: 'Roboto-Bold'
    },

    inputContainer: {
        marginTop: 16,
    },

}

export default UTILITIES