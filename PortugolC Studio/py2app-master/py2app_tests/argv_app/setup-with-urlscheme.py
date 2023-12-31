from setuptools import setup

# A custom plist for letting it associate with a URL protocol.
URLTYPES = [{"CFBundleURLName": "MyUrl", "CFBundleURLSchemes": ["myurl"]}]

plist = {
    "NSAppleScriptEnabled": "YES",
    "CFBundleIdentifier": "com.myurl",
    "LSMinimumSystemVersion": "10.4",
    "CFBundleURLTypes": URLTYPES,
}


setup(
    name="BasicApp",
    app=["main.py"],
    options={
        "py2app": {
            "argv_emulation": True,
            "plist": plist,
        }
    },
)
