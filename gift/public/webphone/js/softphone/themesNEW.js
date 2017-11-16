define([], function() // list and configurations of themes
{
var themelist = {

theme_0: // Default
{
    bgcolorheader: '#1d1d1d',
    bgcolor: '#1d1d1d',
    scrollbarcolor: '#3c3c3c',
    listbgcolor: '#2a2a2a',
    listitembgcolor: '#333333',
    buttoncolor: '#333333',
    buttonhover: '#373737',
    buttonbordercolor: '#1f1f1f',
    tabcolor: '#333333',
    tabselectedcolor: '#22aadd',
    bgdialpadnrfield: '#001a22',
    bgdialpadbtn: '#001a22',
    bgdialpadfooter: '#001a22',
    fontctheme: '#31b6e7',
    fontcwhite: '#ffffff',
    fontcstatus: '#ffffff',
    fontfamily: 'sans-serif'
},

theme_1: // Light
{
    bgcolorheader: '#00AAA0',
    bgcolor: '#00AAA0',
    scrollbarcolor: '#00625C',
    listbgcolor: '#00AAA0',
    listitembgcolor: '#00AAA0',
    buttoncolor: '#8ED2C9',
    buttonhover: '#009A91',
    buttonbordercolor: '#5ec1c3',
    tabcolor: '#00847C',
    tabselectedcolor: '#125D79',
    bgdialpadnrfield: '#00AAA0',
    bgdialpadbtn: '#00AAA0',
    bgdialpadfooter: '#00AAA0',
    fontctheme: '#125d79', 
    fontcwhite: '#ffffff',
    fontcstatus: '#ffffff',
    fontfamily: 'sans-serif'
},

theme_2: // Custom 1 333333 ff9900 666666
{
    bgcolorheader: '#000000',
    bgcolor: '#3BBBF5',
    scrollbarcolor: '#2983AC',
    listbgcolor: '#3BBBF5',
    listitembgcolor: '#3BBBF5',
    buttoncolor: '#2AAAFF',
    buttonhover: '#25A5E0',
    buttonbordercolor: '#25A5E0',
    tabcolor: '#000000',
    tabselectedcolor: '#2AAAFF',
    bgdialpadnrfield: '#3BBBF5',
    bgdialpadbtn: '#3BBBF5', 
    bgdialpadfooter: '#3BBBF5',
    fontctheme: '#FFFFFF', // dialpad number color
    fontcwhite: '#000000',
    fontcstatus: '#FFFFFF',
    fontfamily: 'sans-serif'
},

theme_3: // Custom 2 F2E4E3
{
    bgcolorheader: '#4897D3',
    bgcolor: '#F1F1F1',
    scrollbarcolor: '#9C9B99',
    listbgcolor: '#F1F1F1',
    listitembgcolor: '#F1F1F1',
    buttoncolor: '#4897D3', 
    buttonhover: '#DEDCDA',
    buttonbordercolor: '#E6E6E6',
    tabcolor: '#4797D1',
    tabselectedcolor: '#6666CC',
    bgdialpadnrfield: '#F1F1F1',
    bgdialpadbtn: '#F1F1F1', //dialpad background
    bgdialpadfooter: '#F1F1F1',
    fontctheme: '#4897D3',
    fontcwhite: '#2B2B2B',
    fontcstatus: '#FFFFFF',
    fontfamily: 'sans-serif'
},

theme_4: // Custom 3
{
    bgcolorheader: '#2e3238',
    bgcolor: '#3A414A',
    scrollbarcolor: '#292e34',
    listbgcolor: '#3A414A',
    listitembgcolor: '#3A414A',
    buttoncolor: '#000000',
    buttonhover: '#2e383e',
    buttonbordercolor: '#000000',
    tabcolor: '#2d2b2b',
    tabselectedcolor: '#000000',
    bgdialpadnrfield: '#3A414A',
    bgdialpadbtn: '#3A414A',
    bgdialpadfooter: '#3A414A',
    fontctheme: '#DD191D',
    fontcwhite: '#FF5555',
    fontcstatus: '#D7D9DB',
    fontfamily: 'sans-serif'
},

theme_5: // Custom 4
{
    bgcolorheader: '#dddddd',
    bgcolor: '#f3eeee',
    scrollbarcolor: '#ffffff',
    listbgcolor: '#ffffff',
    listitembgcolor: '#f2eaea',
    buttoncolor: '#D6D4D4',
    buttonhover: '#F6F0F0',
    buttonbordercolor: '#cccccc',
    tabcolor: '#dddddd',
    tabselectedcolor: '#BEB9B9',
    bgdialpadnrfield: '#ffffff',
    bgdialpadbtn: '#FAFAFA',
    bgdialpadfooter: '#DDDDDD',
    fontctheme: '#BAB0B0',
    fontcwhite: '#ACA8A8',
    fontcstatus: '#ffffff',
    fontfamily: 'sans-serif'
},

theme_15: // customized for Favafone
{
    bgcolorheader: '#1d1d1d',
    bgcolor: '#1d1d1d',
    scrollbarcolor: '#3c3c3c',
    listbgcolor: '#2a2a2a',
    listitembgcolor: '#333333',
    buttoncolor: '#39b54d',
    buttonhover: '#32a043',
    buttonbordercolor: '#1f1f1f',
    tabcolor: '#333333',
    tabselectedcolor: '#39b54d',
    bgdialpadnrfield: 'url(images/texture_bg_dial.png) repeat #001a22',
    bgdialpadbtn: 'url(images/texture_bg_dial.png) repeat #001a22',
    bgdialpadfooter: 'url(images/texture_bg_dial.png) repeat #001a22',
    fontctheme: '#71bf44',
    fontcwhite: '#ffffff',
    fontcstatus: '#ffffff',
    fontfamily: 'sans-serif'
},

theme_14: // customized for Kokotalk
{
    bgcolorheader: '#000000',
    bgcolor: '#1d1d1d',
    scrollbarcolor: '#3c3c3c',
    listbgcolor: '#2a2a2a',
    listitembgcolor: '#333333',
    buttoncolor: '#333333',
    buttonhover: '#73a41c',
    buttonbordercolor: '#1f1f1f',
    tabcolor: '#333333',
    tabselectedcolor: '#73a41c',
    bgdialpadnrfield: '#97ca3d',
    bgdialpadbtn: '#97ca3d',
    bgdialpadfooter: '#97ca3d',
    fontctheme: '#97ca3d',
    fontcwhite: '#ffffff',
    fontcstatus: '#ffffff',
    fontfamily: 'sans-serif'
}
/*,

theme_2: // Green
{
    bgcolor: '#1d1d1d',
    buttoncolor: '#333333',
    buttonhover: '#373737',
    tabselectedcolor: '#22aadd',
    fontctheme: '#31b6e7',
    fontcwhite: '#ffffff',
    fontfamily: 'sans-serif'
},

theme_3: // Green Light
{
    bgcolor: '#1d1d1d',
    buttoncolor: '#333333',
    buttonhover: '#373737',
    tabselectedcolor: '#22aadd',
    fontctheme: '#31b6e7',
    fontcwhite: '#ffffff',
    fontfamily: 'sans-serif'
},

theme_4: // Red
{
    bgcolor: '#1d1d1d',
    buttoncolor: '#333333',
    buttonhover: '#373737',
    tabselectedcolor: '#22aadd',
    fontctheme: '#31b6e7',
    fontcwhite: '#ffffff',
    fontfamily: 'sans-serif'
},

theme_5: // Red Light
{
    bgcolor: '#1d1d1d',
    buttoncolor: '#333333',
    buttonhover: '#373737',
    tabselectedcolor: '#22aadd',
    fontctheme: '#31b6e7',
    fontcwhite: '#ffffff',
    fontfamily: 'sans-serif'
},

theme_6: // Yellow
{
    bgcolor: '#1d1d1d',
    buttoncolor: '#333333',
    buttonhover: '#373737',
    tabselectedcolor: '#22aadd',
    fontctheme: '#31b6e7',
    fontcwhite: '#ffffff',
    fontfamily: 'sans-serif'
},

theme_7: // Yellow Light
{
    bgcolor: '#1d1d1d',
    buttoncolor: '#333333',
    buttonhover: '#373737',
    tabselectedcolor: '#22aadd',
    fontctheme: '#31b6e7',
    fontcwhite: '#ffffff',
    fontfamily: 'sans-serif'
},

theme_8: // Magenta
{
    bgcolor: '#1d1d1d',
    buttoncolor: '#333333',
    buttonhover: '#373737',
    tabselectedcolor: '#22aadd',
    fontctheme: '#31b6e7',
    fontcwhite: '#ffffff',
    fontfamily: 'sans-serif'
},

theme_9: // Magenta Light
{
    bgcolor: '#1d1d1d',
    buttoncolor: '#333333',
    buttonhover: '#373737',
    tabselectedcolor: '#22aadd',
    fontctheme: '#31b6e7',
    fontcwhite: '#ffffff',
    fontfamily: 'sans-serif'
},
*/
};

var themes = {

gettheme: function (name)
{
    if (typeof (name) === 'undefined' || name === null) { return null; }

    name = name.toLowerCase();

    if (typeof (themelist[name]) === 'undefined' || themelist[name] === null)
    {
        return null;
    }

    return themelist[name];
}
};
return themes;
});