{pkgs}: {
  deps = [
    pkgs.chromium
    pkgs.xorg.libXi
    pkgs.xorg.libXcursor
    pkgs.expat
    pkgs.cairo
    pkgs.gtk3
    pkgs.nspr
    pkgs.alsa-lib
    pkgs.pango
    pkgs.mesa
    pkgs.xorg.libXrandr
    pkgs.xorg.libXfixes
    pkgs.xorg.libXext
    pkgs.xorg.libXdamage
    pkgs.xorg.libXcomposite
    pkgs.xorg.libX11
    pkgs.libxkbcommon
    pkgs.libdrm
    pkgs.dbus
    pkgs.cups
    pkgs.at-spi2-atk
    pkgs.atk
    pkgs.nss
    pkgs.glib
  ];
}
