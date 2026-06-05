using DtoLayer;
using RepositoryLayer.AuthnticateRepo.Interface;
using UtilityLayer.PasswordHash;

namespace RepositoryLayer.AuthnticateRepo.Repository
{
    public class BS_AuthnticateLogin : IBS_AuthnticateLogin
    {
        private readonly IAuthnticateLogin _login;
        public BS_AuthnticateLogin(IAuthnticateLogin login) {
            _login = login;
        }

        public async Task<(int result, string errorMessage)> clearTwoFactorDetails(int? EmpId)
        {
            return await _login.clearTwoFactorDetails(EmpId);
        }

        public async Task<List<AuthenticationSettingDto>> getBS_ListOfAuthSetting()
        {
            return await _login.getListOfAuthSetting();
        }

        public async Task<RegistrationDto> getRegistrationDetails(string? email)
        {
            return await _login.getRegistrationDetails(email);
        }

        public async Task<UserTwoFactorDto> getUserTwoFactorDto(int EmpId)
        {
            return await _login.getUserTwoFactorDto(EmpId);    
        }

        public async Task<(int result, string errorMessage)> saveTwoFactorDetails(UserTwoFactorDto user)
        {
            return await _login.saveTwoFactorDetails(user);

        }

        public async Task<(int result, string errorMessage)> updateTwoFactor(UserTwoFactorDto user)
        {
            return await _login.updateTwoFactor(user);

        }

        public async Task<(int result, string errorMessage, RegistrationDto? user)> validateLogin(RegistrationDto user)
        {
            if(user.Password is not null || user.Password != "")
                user.Password = PasswordHash.EncryptString(user.Password);
            
            return await _login.validateLogin(user);
        }
    }
}
