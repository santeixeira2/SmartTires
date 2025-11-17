# Multi-stage Dockerfile for React Native Android builds
# Note: iOS builds require macOS, so they must be done on the host

FROM node:20-bullseye

# Install Java and Android build tools
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    wget \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Auto-detect Java path based on architecture (ARM64 vs AMD64)
RUN JAVA_PATH=$(find /usr/lib/jvm -maxdepth 1 -name "java-17-openjdk-*" -type d | head -1) && \
    echo "Detected Java path: $JAVA_PATH" && \
    update-alternatives --install /usr/bin/java java $JAVA_PATH/bin/java 1 && \
    update-alternatives --install /usr/bin/javac javac $JAVA_PATH/bin/javac 1 && \
    echo "JAVA_HOME=$JAVA_PATH" >> /etc/environment

# Set Java environment (will be set dynamically)
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin

# Verify Java installation and set correct JAVA_HOME
RUN JAVA_PATH=$(find /usr/lib/jvm -maxdepth 1 -name "java-17-openjdk-*" -type d | head -1) && \
    export JAVA_HOME=$JAVA_PATH && \
    export PATH=$PATH:$JAVA_HOME/bin && \
    java -version && \
    javac -version && \
    echo "JAVA_HOME set to: $JAVA_HOME"

# Install Android SDK
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=$ANDROID_HOME
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Create Android SDK directory
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip commandlinetools-linux-9477386_latest.zip -d $ANDROID_HOME/cmdline-tools && \
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest && \
    rm commandlinetools-linux-9477386_latest.zip

# Accept Android licenses and install required packages
# Set JAVA_HOME dynamically based on architecture
RUN JAVA_PATH=$(find /usr/lib/jvm -maxdepth 1 -name "java-17-openjdk-*" -type d | head -1) && \
    export JAVA_HOME=$JAVA_PATH && \
    export PATH=$PATH:$JAVA_HOME/bin && \
    yes | sdkmanager --licenses || true && \
    sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0" "ndk;27.1.12297006"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install Node dependencies
RUN npm install -g react-native-cli@latest
# Use --legacy-peer-deps to handle React 19 compatibility with packages expecting React 17/18
RUN npm ci --legacy-peer-deps || (npm install --legacy-peer-deps && echo "Installed with npm") || (yarn install --frozen-lockfile && echo "Installed with yarn")

# Copy project files
COPY . .

# Build Android APK - BYPASSED (build on host instead)
# Set JAVA_HOME dynamically for Gradle
# RUN JAVA_PATH=$(find /usr/lib/jvm -maxdepth 1 -name "java-17-openjdk-*" -type d | head -1) && \
#     export JAVA_HOME=$JAVA_PATH && \
#     export PATH=$PATH:$JAVA_HOME/bin && \
#     cd android && ./gradlew assembleDebug

# Default command (can be overridden)
CMD ["bash"]

