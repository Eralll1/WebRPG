class cookies{
    get(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    set(name, value, params = {}){
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        // encodeURIComponent(key) - не знаю на сколько это работает
        for (const [key, value_] of Object.entries(params)) {
            updatedCookie += ";" + encodeURIComponent(key) + "=" + encodeURIComponent(value_)
          }
        document.cookie = updatedCookie;
    }
}

export default new cookies