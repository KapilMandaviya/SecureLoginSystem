using DtoLayer;

namespace RepositoryLayer.AuthnticateRepo.Interface
{
    public interface IAuthnticateLogin
    {
        Task<(int result, string errorMessage, RegistrationDto? user)> validateLogin(RegistrationDto user);
        Task<List<AuthenticationSettingDto>>getListOfAuthSetting();
        Task<RegistrationDto> getRegistrationDetails(string? email);
        Task<UserTwoFactorDto> getUserTwoFactorDto(int EmpId);

        Task<(int result, string errorMessage)> saveTwoFactorDetails(UserTwoFactorDto user);
        Task<(int result, string errorMessage)> updateTwoFactor(UserTwoFactorDto user);
        Task<(int result, string errorMessage)> clearTwoFactorDetails(int? EmpId);
    }
}
