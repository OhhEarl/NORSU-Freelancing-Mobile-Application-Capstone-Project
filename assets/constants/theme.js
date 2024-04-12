import COLORS from "./colors"


const colors = {
    lightWhite: '#f0f0f0',
    lightBlack: '#252525',
    gray: '#636e72',
    BG: '#F2F0F7',
    WHITE: '#FFF',
    BLACKS: '#000000',
    PLACEHOLDER_COLOR: '#8B8B8B',
    GRAY_LIGHT: 'lightgray',
    ORANGE: 'orange',
    primary: "#1B6B93",
    secondary: "#164B60",
    tertiary: "A2FF86",
    grey: "#CCCCCC",
    inputField: "#EAEAEA"
}

const sizes = {
    h1: 10,
    h2: 13,
    h3: 15,
    h4: 20,
    h5: 25,
    h6: 28
}

const utilities = {
    inputField: {
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 10,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 16,
        fontFamily: 'Raleway-Medium',
        backgroundColor: "#EAEAEA",
        color: 'black'
    },
    title: {
        marginBottom: 5,
        marginStart: 4,
        fontFamily: 'Roboto-Bold',
        color: "#000000",
        fontSize: 16
    },

    header: {
        fontSize: 25,
        color: "#1B6B93",
        fontFamily: 'Roboto-Bold'
    },

    inputContainer: {
        marginTop: 16,
    },

}

export {
    utilities,
    sizes,
    colors
}