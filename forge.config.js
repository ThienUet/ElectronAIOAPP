const path = require('path');
module.exports = {
  packagerConfig: {
    icon: './public/icon/ViThienOEM.ico', 
    asar: true,
    extraResource: [
      "./app/cpu-z-64bit.exe" // Thay 'path/to/your/file.exe' bằng đường dẫn tới tệp exe của bạn
    ]
  },

  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // The ICO file to use as the icon for the generated Setup.exe
        setupIcon: './public/icon/ViThienOEM.ico'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
