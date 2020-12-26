$ErrorActionPreference='Stop'
choco feature disable -n=showDownloadProgress
#  wget https://github.com/dokan-dev/dokany/releases/download/v1.2.2.1000/DokanSetup_redist.exe -OutFile DokanSetup_redist.exe
# .\DokanSetup_redist.exe /passive /norestart
# wget https://download.visualstudio.microsoft.com/download/pr/11100229/78c1e864d806e36f6035d80a0e80399e/VC_redist.x86.exe -OutFile VC_redist.x86.exe
# .\VC_redist.x86.exe /passive /norestart
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
dir "C:\Program Files\dokan"