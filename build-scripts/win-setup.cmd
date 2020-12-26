choco feature disable -n=showDownloadProgress
curl.exe --output vc_redist.x64.exe --location --url https://aka.ms/vs/16/release/vc_redist.x64.exe
Start-Process msiexec.exe -Wait -ArgumentList '/I vc_redist.x64.exe /quiet /qn /norestart /L*V “vc.log”’
curl.exe --output dokan64.msi --location  https://github.com/dokan-dev/dokany/releases/latest/download/Dokan_x64.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I dokan64.msi /quiet /qn /norestart /L*V "dokan.log"'
curl.exe --output cryfs64.msi --location --url https://github.com/cryfs/cryfs/releases/download/0.10.2/cryfs-0.10.2-win64.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I cryfs64.msi /quiet /qn /norestart /L*V "cryfs.log"'
echo "::group::Printing logs"
type *.log
echo "::endgroup::"
copy 'C:\Program Files\CryFS\0.10.2\bin\*' 'C:\Windows' 
echo "C:\Program Files\CryFS\0.10.2\bin\" >> $GITHUB_PATH
setx /M CRYFS_FRONTEND "noninteractive"
echo "::group::installing encfs4win"
echo "::endgroup::"
choco install encfs4win --pre
echo "C:\Program Files (x86)\encfs'\" >> $GITHUB_PATH
copy "C:\Program Files (x86)\encfs\*" "C:\Windows"
encfs.exe --version
cryfs.exe --version