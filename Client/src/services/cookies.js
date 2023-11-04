class cookies{
    get(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    set(name, value){
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        document.cookie = updatedCookie;
    }
}

export default new cookies