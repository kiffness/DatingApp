using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        //Mapping configuration
        public AutoMapperProfiles()
        {
            //Map the Photo Url in MemberDto to the main photo Url in Photo, Cause AppUser does not have a photoUrl prop so won't be automapped, automapper maps properties with the same name
            //Second Map, Calculates the age using our calculate age extension
            CreateMap<AppUser, MemberDto>()
            //dest is memberDto photoUrl prop, options is where to MapFrom, src is the Photos Table in database, where the first or default where the photo isMain true, then select the url
                .ForMember(dest => dest.PhotUrl, opt => opt.MapFrom(src 
                    => src.Photos.FirstOrDefault(x => x.IsMain).Url))
            //Dest is the Age in the MemberDto, opt is the options so map from source DateOfBirth on the AppUser Prop and do the CalculateAge method on that prop then map to Age
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src 
                    => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
        }
    }
}