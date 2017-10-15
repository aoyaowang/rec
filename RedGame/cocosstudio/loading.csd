<GameFile>
  <PropertyGroup Name="loading" Type="Layer" ID="650f2aeb-c84f-458b-a88a-794dd37eefd7" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="25" Speed="1.0000" ActivedAnimationName="run">
        <Timeline ActionTag="-2013989809" Property="Position">
          <PointFrame FrameIndex="0" X="412.6169" Y="454.9412">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="5" X="412.6169" Y="454.9412">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="10" X="412.6169" Y="454.9412">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="15" X="412.6169" Y="454.9412">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="20" X="412.6169" Y="454.9412">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="25" X="412.6169" Y="454.9412">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-2013989809" Property="Scale">
          <ScaleFrame FrameIndex="0" X="0.5000" Y="0.5000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="5" X="0.5000" Y="0.5000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="10" X="0.5000" Y="0.5000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="15" X="0.5000" Y="0.5000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="20" X="0.5000" Y="0.5000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="25" X="0.5000" Y="0.5000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="-2013989809" Property="RotationSkew">
          <ScaleFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="5" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="10" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="15" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="20" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="25" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="-2013989809" Property="FileData">
          <TextureFrame FrameIndex="5" Tween="False">
            <TextureFile Type="Normal" Path="loading/loadingNew1.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="10" Tween="False">
            <TextureFile Type="Normal" Path="loading/loadingNew2.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="15" Tween="False">
            <TextureFile Type="Normal" Path="loading/loadingNew3.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="20" Tween="False">
            <TextureFile Type="Normal" Path="loading/loadingNew4.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="25" Tween="False">
            <TextureFile Type="Normal" Path="loading/loadingNew5.png" Plist="" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="-2013989809" Property="BlendFunc">
          <BlendFuncFrame FrameIndex="5" Tween="False" Src="1" Dst="771" />
          <BlendFuncFrame FrameIndex="10" Tween="False" Src="1" Dst="771" />
          <BlendFuncFrame FrameIndex="15" Tween="False" Src="1" Dst="771" />
          <BlendFuncFrame FrameIndex="20" Tween="False" Src="1" Dst="771" />
          <BlendFuncFrame FrameIndex="25" Tween="False" Src="1" Dst="771" />
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="run" StartIndex="0" EndIndex="25">
          <RenderColor A="255" R="34" G="139" B="34" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Layer" Tag="88" ctype="GameLayerObjectData">
        <Size X="640.0000" Y="1038.0000" />
        <Children>
          <AbstractNodeData Name="loadingNew_bk_1" ActionTag="205923348" Tag="9" IconVisible="False" LeftMargin="89.4341" RightMargin="90.5659" TopMargin="338.8120" BottomMargin="401.1880" ctype="SpriteObjectData">
            <Size X="460.0000" Y="298.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="319.4341" Y="550.1880" />
            <Scale ScaleX="1.2692" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.4991" Y="0.5300" />
            <PreSize X="0.7188" Y="0.2871" />
            <FileData Type="Normal" Path="loading/loadingNew_bk.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="Node_1" ActionTag="-1477532306" Tag="21" IconVisible="True" RightMargin="640.0000" TopMargin="1038.0000" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <Children>
              <AbstractNodeData Name="loadbar" ActionTag="1787473963" Tag="89" IconVisible="False" LeftMargin="-90.8943" RightMargin="-726.1057" TopMargin="-574.5490" BottomMargin="502.5490" ProgressInfo="100" ctype="LoadingBarObjectData">
                <Size X="817.0000" Y="72.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="317.6057" Y="538.5490" />
                <Scale ScaleX="0.6752" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <ImageFileData Type="Normal" Path="loading/loadingNew_bk1.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="loadingNew_text_2" ActionTag="1831199714" Tag="10" IconVisible="False" LeftMargin="217.4519" RightMargin="-323.4519" TopMargin="-465.5489" BottomMargin="430.5489" ctype="SpriteObjectData">
                <Size X="106.0000" Y="35.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="270.4519" Y="448.0489" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Normal" Path="loading/loadingNew_text.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="Sprite_3" ActionTag="-2013989809" Tag="11" IconVisible="False" LeftMargin="260.7979" RightMargin="-574.7979" TopMargin="-536.4732" BottomMargin="366.4732" ctype="SpriteObjectData">
                <Size X="314.0000" Y="170.0000" />
                <AnchorPoint ScaleX="0.4835" ScaleY="0.5204" />
                <Position X="412.6169" Y="454.9412" />
                <Scale ScaleX="0.5000" ScaleY="0.5000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Normal" Path="loading/loadingNew1.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="Node_2" ActionTag="52351838" VisibleForFrame="False" Tag="22" IconVisible="True" RightMargin="640.0000" TopMargin="1038.0000" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <Children>
              <AbstractNodeData Name="ft_account" ActionTag="-509743730" Tag="23" IconVisible="False" LeftMargin="146.0680" RightMargin="-506.0680" TopMargin="-583.5779" BottomMargin="533.5779" TouchEnable="True" FontSize="36" IsCustomSize="True" LabelText="" PlaceHolderText="手机号" MaxLengthText="10" ctype="TextFieldObjectData">
                <Size X="360.0000" Y="50.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="326.0680" Y="558.5779" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="ft_code" ActionTag="-748531763" Tag="24" IconVisible="False" LeftMargin="146.0674" RightMargin="-326.0674" TopMargin="-506.0621" BottomMargin="456.0621" TouchEnable="True" FontSize="36" IsCustomSize="True" LabelText="" PlaceHolderText="验证码" MaxLengthText="10" ctype="TextFieldObjectData">
                <Size X="180.0000" Y="50.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="236.0674" Y="481.0621" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="Button_1" ActionTag="1815619949" Tag="25" IconVisible="False" LeftMargin="373.3535" RightMargin="-493.3535" TopMargin="-509.5081" BottomMargin="459.5081" TouchEnable="True" FontSize="24" ButtonText="获取验证码" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="16" Scale9Height="14" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="120.0000" Y="50.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="433.3535" Y="484.5081" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                <NormalFileData Type="Default" Path="Default/Button_Normal.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>