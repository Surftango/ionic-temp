/*
*
* Copyright (c) 2016-present CA Technologies
* All rights reserved.
*
*/


MAA SDK Library integration (Wrapping)
======================================

CLI
===
1. Extract CAMobileAppAnalytics-wrapper.zip
2. Download the plist file of <your_app_project>, normally from the MAA web dashboard/portal
3. Open a command shell and change directory to CAMobileAppAnalytics-wrapper
4. Run the following command ./wrap.sh -a <path_to_apk> -p <your_app_project_camdo.plist>
5. Find the wrapped_<apk_file_name> in the same folder as your apk
6. Sign the wrapped apk with your certificate (Optional)

Gradle
======
1. Extract CAMobileAppAnalytics-wrapper.zip in to a folder under your project, say <project root>/thirdparty/CAMobileAppAnalytics-wrapper. Please note that this folder should not be part of the project soure/resources.
2. Download the plist file of <your_app_project>, normally from the MAA web dashboard/portal and copy to the extracted SDK folder
3. Update the global build.gradle file of your project with the CA gradle task. Say something like
    classpath files('thirdparty/CAMobileAppAnalytics-wrapper/ca-maa-android-sdk-wrapper-<version>.jar')
4. Open the app's build.gradle and
    1. Apply the imported plugin from #5 like, apply plugin: 'ca-maa-wrapper-plugin'
    2. Add an 'afterEvaluate' block like below
    '''code

    afterEvaluate {
        android.applicationVariants.all { variant ->
            def newWrapperTask = tasks.create(name: "${variant.name}MAAWrap", type: com.ca.android.wrapper.gradle.CAMAAWrapperTask)
            String currentDir = new File(".").absolutePath
            String emmFile = currentDir + "/thirdparty/CAMobileAppAnalytics-wrapper/emm"
            File emmHome = new File(emmFile)
            newWrapperTask.ext.emmHome = emmHome.absolutePath
            newWrapperTask.ext.plistFilePath = currentDir + "/thirdparty/CAMobileAppAnalytics-wrapper/<app.plist>"
            newWrapperTask.ext.signConfig = currentDir + "/thirdparty/CAMobileAppAnalytics-wrapper/emm/conf/jarsigner.properties"
            variant.outputs.each { output ->
                newWrapperTask.ext.apkFilePath = output.outputFile.toString()
                newWrapperTask.dependsOn output.packageApplication
            }
            variant.assemble.dependsOn newWrapperTask
        }
    }
    '''code
6. Run the gradle tasks like assembleDebug or assembleRelease. Each variant will be wrapped separately by the plugin.

Using Custom APIs
==================

To use custom APIs, you must integrate the application with the SDK.

1. Make the integration files available to the application
    a. Copy the "com" dir from the archive to the source dir of the app. This copies
       CaMDOIntegration.java and  CaMDOCallback.java, that are required for using custom APIs.
    b. Using .aar
       1. Import the ca-maa-android-integration-<version>.aar from the extracted SDK folder, in to the project as a Module
       2. Add the imported module as a dependency to the application's build.gradle
2. Make the api calls, exposed in the CaMDOIntegration.java file, from the application.
3. Wrap the app (apk) with the SDK,As mentioned in the "MAA SDK Library integration" section. More info at https://docops.ca.com/ca-app-experience-analytics-digital-experience-insights-from-ca/ga/en/configuring/collect-data-from-android-applications/integrate-the-application-with-sdk-using-gradle-plugin