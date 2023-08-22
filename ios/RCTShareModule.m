#import "RCTShareModule.h"
#import <React/RCTLinkingManager.h>

@interface RCTShareModule()

@property (nonatomic, strong) NSString *sharedData;

@end

@implementation RCTShareModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(receiveSharedData:(RCTResponseSenderBlock)callback) {
    NSLog(@"receiveSharedData called");
    
    NSUserDefaults *sharedDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.com.ww8007.pickly"];
    NSString *sharedData = [sharedDefaults objectForKey:@"sharedData"];
    
    if (sharedData) {
        NSLog(@"receiveSharedData called@");
        callback(@[[NSNull null], sharedData]);
        // 초기화
        [sharedDefaults removeObjectForKey:@"sharedData"]; // 데이터 초기화
        [sharedDefaults synchronize];
    } else {
        NSLog(@"No shared data available");
        callback(@[@"No data available", [NSNull null]]);
    }
}

RCT_EXPORT_METHOD(setMemberId:(NSString *)memberId) {
    NSLog(@"Setting memberId: %@", memberId);
    
    NSUserDefaults *sharedDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.com.ww8007.pickly"];
    [sharedDefaults setObject:memberId forKey:@"memberId"];
    [sharedDefaults synchronize]; // 변경 사항 동기화
}


@end
